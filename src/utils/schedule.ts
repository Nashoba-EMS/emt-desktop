import moment from "moment";

import { Schedule, ScheduleAvailability, ScheduleDay } from "../api/schedules.d";
import { UserWithoutPassword } from "../api/users.d";
import { getDaysInSchedule } from "./datetime";
import { shuffle } from "./shuffle";

/**
 * Build a valid schedule based on availability and crew requirements
 */
export const buildSchedule = (
  schedule: Schedule,
  users: UserWithoutPassword[],
  userAvailability: ScheduleAvailability[]
): Schedule => {
  // Build maps to quickly look up users and availability by user ID
  const userIdToUser: {
    [_id: string]: UserWithoutPassword | undefined;
  } = {};
  const userIdToAvailability: {
    [_id: string]: ScheduleAvailability | undefined;
  } = {};

  users = shuffle(users.filter((user) => user.eligible));

  users.forEach((user) => (userIdToUser[user._id] = user));
  userAvailability.forEach((availability) => (userIdToAvailability[availability.user_id] = availability));

  const days = getDaysInSchedule(schedule);

  const dayToCadetIds: {
    [date: string]: ScheduleDay["cadet_ids"] | undefined;
  } = {};
  const cadetIdToDays: {
    [_id: string]: string[] | undefined;
  } = {};

  const crewChiefs = users.filter((user) => user.chief);
  const certifieds = users.filter((user) => user.certified && !user.chief);
  const nonChiefs = users.filter((user) => !user.chief);

  /**
   * Check if a cadet is available on a given day
   */
  const isCadetAvailable = (day: string, id: string) => {
    return userIdToAvailability[id]?.days.includes(day);
  };

  /**
   * Check if a cadet is assigned on a given day
   */
  const isCadetAssigned = (day: string, id: string) => {
    return dayToCadetIds[day]?.includes(id);
  };

  /**
   * Check if a cadet can be assigned to a given day
   */
  const canAssignCadet = (day: string, id: string) => {
    return isCadetAvailable(day, id) && !isCadetAssigned(day, id);
  };

  /**
   * Rotate over given cadets and add first available to day
   */
  const addCadets = (cadets: UserWithoutPassword[]) => {
    const used = new Set();

    /**
     * Add a cadet and remember they were added
     */
    const addCadet = (day: string, cadet: UserWithoutPassword) => {
      if (dayToCadetIds[day]) {
        dayToCadetIds[day]?.push(cadet._id);
      } else {
        dayToCadetIds[day] = [cadet._id];
      }

      if (cadetIdToDays[cadet._id]) {
        cadetIdToDays[cadet._id]?.push(day);
      } else {
        cadetIdToDays[cadet._id] = [day];
      }

      used.add(cadet._id);

      if (used.size === cadets.length) {
        used.clear();
      }
    };

    days.forEach((day) => {
      // Try to add a cadet who hasn't been added recently
      for (const cadet of cadets) {
        if (!used.has(cadet._id) && canAssignCadet(day, cadet._id)) {
          addCadet(day, cadet);
          return;
        }
      }

      // If no cadet added, add first one found
      for (const cadet of cadets) {
        if (canAssignCadet(day, cadet._id)) {
          addCadet(day, cadet);
          break;
        }
      }
    });
  };

  /**
   * Remove a given cadet from the day and replace them with a new one
   */
  const replaceCadet = (day: string, oldId: string, newId: string) => {
    cadetIdToDays[oldId] = cadetIdToDays[oldId]?.filter((thisDay) => day !== thisDay);
    dayToCadetIds[day] = dayToCadetIds[day]?.filter((_id) => _id !== oldId);

    dayToCadetIds[day]?.push(newId);

    if (cadetIdToDays[newId]) {
      cadetIdToDays[newId]?.push(day);
    } else {
      cadetIdToDays[newId] = [day];
    }
  };

  /**
   * Check if a given day has at least one male and female
   */
  const isGenderBalanced = (day: string) => {
    let males = 0;
    let females = 0;

    dayToCadetIds[day]?.forEach((id) => {
      const gender = userIdToUser[id]?.gender;

      if (gender === "M") {
        males++;
      } else if (gender === "F") {
        females++;
      }
    });

    return { balanced: males > 0 && females > 0, males, females };
  };

  const getOnCallSpread = (
    availableCadets: UserWithoutPassword[],
    day: string,
    modifyLow: boolean,
    modifyHigh: boolean
  ) => {
    let lowestCadetId = "";
    let lowestCadetDays = Infinity;

    let highestCadetId = "";
    let highestCadetDays = 0;

    // Find the highest and lowest on-call counts
    // Certified cadets are weighted differently to increase their expected count
    availableCadets.forEach((cadet) => {
      const thisCadetDays = cadetIdToDays[cadet._id]?.length ?? 0;
      const modifier = cadet.certified ? 1 : 0;
      const lowModifier = modifyLow ? modifier : 0;
      const highModifier = modifyHigh ? modifier : 0;

      if (thisCadetDays - lowModifier < lowestCadetDays && !isCadetAssigned(day, cadet._id)) {
        lowestCadetId = cadet._id;
        lowestCadetDays = thisCadetDays - lowModifier;
      }

      if (thisCadetDays - highModifier > highestCadetDays && isCadetAssigned(day, cadet._id)) {
        highestCadetId = cadet._id;
        highestCadetDays = thisCadetDays - highModifier;
      }
    });

    return { lowestCadetDays, lowestCadetId, highestCadetDays, highestCadetId };
  };

  /**
   * Check if the schedule is balanced for both cadet on-call counts and gender
   */
  const isScheduleBalanced = () => {
    // Verify that each day is balanced by cadet on-call counts
    for (const day of days) {
      const availableCadets = nonChiefs.filter((cadet) => isCadetAvailable(day, cadet._id));
      const numberOfCertifieds =
        dayToCadetIds[day]?.map((cadetId) => userIdToUser[cadetId]).filter((cadet) => !cadet?.chief && cadet?.certified)
          .length ?? 0;

      const { lowestCadetDays, lowestCadetId, highestCadetDays, highestCadetId } = getOnCallSpread(
        availableCadets,
        day,
        true,
        true
      );

      if (highestCadetDays - lowestCadetDays >= 2 && numberOfCertifieds > 1) {
        console.log(`${day} is not cadet balanced`, {
          day,
          highestUser: userIdToUser[highestCadetId]?.name,
          lowestUser: userIdToUser[lowestCadetId]?.name,
          highestCadetDays,
          lowestCadetDays
        });
        return false;
      }
    }

    // Verify that each day is balanced by gender
    for (const day of days) {
      if (!isGenderBalanced(day).balanced) {
        console.log(`${day} is not gender balanced`);
        return false;
      }
    }
    return true;
  };

  // Add a chief to every day
  addCadets(crewChiefs);

  // Balance the chiefs' days
  const balanceChiefs = () => {
    days.forEach((day) => {
      const availableChiefs = crewChiefs.filter((cadet) => isCadetAvailable(day, cadet._id));
      const currentChiefId = dayToCadetIds[day]?.[0] ?? "";
      const currentChiefDays = cadetIdToDays[currentChiefId]?.length ?? 0;

      let lowestChiefId = "";
      let lowestChiefDays = Infinity;
      availableChiefs.forEach((cadet) => {
        if (currentChiefId === cadet._id) {
          return;
        }

        const thisChiefDays = cadetIdToDays[cadet._id]?.length ?? 0;

        if (thisChiefDays < lowestChiefDays) {
          lowestChiefId = cadet._id;
          lowestChiefDays = thisChiefDays;
        }
      });

      if (currentChiefDays - lowestChiefDays >= 2) {
        replaceCadet(day, currentChiefId, lowestChiefId);
      }
    });
  };

  balanceChiefs();
  balanceChiefs();

  // Add a certified to every day
  addCadets(certifieds);

  // Add a nonChief to every day, twice
  addCadets(nonChiefs);
  addCadets(nonChiefs);

  let i = 0;
  while (!isScheduleBalanced()) {
    for (const day of days) {
      const availableCadets = shuffle(nonChiefs.filter((cadet) => isCadetAvailable(day, cadet._id)));
      let numberOfCertifieds =
        dayToCadetIds[day]?.map((cadetId) => userIdToUser[cadetId]).filter((cadet) => !cadet?.chief && cadet?.certified)
          .length ?? 0;

      const { lowestCadetDays, lowestCadetId, highestCadetDays, highestCadetId } = getOnCallSpread(
        availableCadets,
        day,
        true,
        false
      );

      // Only replace the highest candidate if it won't effect the required number of certifieds
      if (
        highestCadetDays > -1 &&
        lowestCadetDays < Infinity &&
        highestCadetDays - lowestCadetDays >= 2 &&
        (!userIdToUser[highestCadetId]?.certified || numberOfCertifieds > 1 || userIdToUser[lowestCadetId]?.certified)
      ) {
        console.log("Replacement:", {
          day,
          highestUser: userIdToUser[highestCadetId]?.name,
          lowestUser: userIdToUser[lowestCadetId]?.name,
          highestCadetDays,
          lowestCadetDays
        });
        replaceCadet(day, highestCadetId, lowestCadetId);
      }

      // Update the number of certifieds now that changes might have been made
      numberOfCertifieds =
        dayToCadetIds[day]?.map((cadetId) => userIdToUser[cadetId]).filter((cadet) => !cadet?.chief && cadet?.certified)
          .length ?? 0;

      const genderBalance = isGenderBalanced(day);

      if (!genderBalance.balanced) {
        // Replace the highest count of the highest gender with the lowest of the unassigned gender
        // available on the given day
        const newGender = genderBalance.males > genderBalance.females ? "F" : "M";
        const newGenderAvailableCadets = availableCadets.filter((cadet) => cadet.gender === newGender && !cadet.chief);

        let lowestNewGenderCadetId = "";
        let lowestNewGenderCadetDays = Infinity;

        // Find the lowest of the missing gender
        newGenderAvailableCadets.forEach((cadet) => {
          const thisCadetDays = cadetIdToDays[cadet._id]?.length ?? 0;

          if (
            thisCadetDays < lowestNewGenderCadetDays &&
            ((numberOfCertifieds > 1 && !cadet.certified) || (numberOfCertifieds === 1 && cadet.certified))
          ) {
            lowestNewGenderCadetId = cadet._id;
            lowestNewGenderCadetDays = thisCadetDays;
          }
        });

        let highestOldGenderCadetId = "";
        let highestOldGenderCadetDays = -1;

        // Only add non-chiefs in the search for who to remove from the day, chiefs should never be removed
        dayToCadetIds[day]
          ?.map((cadetId) => userIdToUser[cadetId])
          .filter((cadet) => !cadet?.chief)
          .forEach((cadet) => {
            if (!cadet) return;

            const thisCadetDays = cadetIdToDays[cadet._id]?.length ?? 0;

            if (thisCadetDays > highestOldGenderCadetDays && (numberOfCertifieds > 1 || !cadet.certified)) {
              highestOldGenderCadetId = cadet._id;
              highestOldGenderCadetDays = thisCadetDays;
            }
          });

        if (lowestNewGenderCadetDays < Infinity && highestOldGenderCadetDays > -1) {
          replaceCadet(day, highestOldGenderCadetId, lowestNewGenderCadetId);
        }
      }
    }

    console.log("Iteration:", i);

    // Only try to balance 10 times
    i++;
    if (i >= 10) break;
  }

  // Get diagnostic info to quickly verify that cadets have a good distribution
  const onCallCounts: {
    cadetName: string;
    certified: boolean;
    cadetDays: number;
  }[] = [];

  for (const [cadetId, cadetDays] of Object.entries(cadetIdToDays)) {
    const cadet = userIdToUser[cadetId];

    if (cadet?.chief === false) {
      onCallCounts.push({
        cadetName: cadet.name,
        certified: cadet.certified,
        cadetDays: cadetDays?.length ?? 0
      });
    }
  }

  onCallCounts.sort((a, b) => b.cadetDays - a.cadetDays);

  console.log("On call balance:", onCallCounts);
  console.log("Is schedule balanced:", isScheduleBalanced());

  return {
    ...schedule,
    assignments: days.map((day) => {
      // Sort the cadets by chief >> certified >> uncertified
      const cadets = dayToCadetIds[day]?.map((cadetId) => userIdToUser[cadetId]);
      const chiefCadets = cadets?.filter((cadet) => cadet?.chief) ?? [];
      const certCadets = cadets?.filter((cadet) => cadet?.certified && !cadet?.chief) ?? [];
      const uncertCadets = cadets?.filter((cadet) => !cadet?.certified && !cadet?.chief) ?? [];
      const cadet_ids = [...chiefCadets, ...certCadets, ...uncertCadets].map((cadet) => cadet?._id ?? "");

      return {
        date: day,
        cadet_ids
      };
    })
  };
};
