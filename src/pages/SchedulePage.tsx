import React from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Event, momentLocalizer } from "react-big-calendar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { ReduxState } from "../redux";
import { _schedules } from "../redux/actions";
import { Schedule, ScheduleDay } from "../api/schedules.d";
import { buildSchedule } from "../utils/schedule";
import { isDayValid } from "../utils/datetime";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      paddingBottom: theme.spacing(2)
    },
    paperTabs: {
      marginBottom: theme.spacing(2)
    },
    paddedGrid: {
      marginTop: theme.spacing(1)
    },
    paddedButton: {
      marginRight: theme.spacing(2)
    },
    checkboxContainer: {
      marginRight: theme.spacing(2)
    },
    paper: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3)
    },
    calendarContainer: {},
    calendarDay: {
      "&:hover": {
        cursor: "pointer",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#A0A0A0"
      }
    },
    clearButton: {
      marginRight: theme.spacing(1)
    },
    spinner: {
      marginLeft: 2,
      marginRight: 2
    }
  })
);

const localizer = momentLocalizer(moment);

const compareScheduleDay = (a: ScheduleDay, b: ScheduleDay) => {
  if (a.date < b.date) {
    return -1;
  }

  if (a.date > b.date) {
    return 1;
  }

  return 0;
};

type CalendarEvent = Event & {
  user_id: string;
  chief: boolean;
  certified: boolean;
};

const compareEvents = (a: CalendarEvent, b: CalendarEvent) => {
  const aValue = `${a.chief ? "A" : a.certified ? "B" : "C"} ${a.title}`;
  const bValue = `${b.chief ? "A" : b.certified ? "B" : "C"} ${b.title}`;

  if (aValue < bValue) {
    return -1;
  }

  if (aValue > bValue) {
    return 1;
  }

  return 0;
};

const SchedulePage: React.FC = () => {
  const classes = useStyles();

  const { schedule_id } = useParams<{ schedule_id: string }>();
  const history = useHistory();

  const user = useSelector((state: ReduxState) => state.users.user);
  const cadets = useSelector((state: ReduxState) => state.users.cadets);
  const token = useSelector((state: ReduxState) => state.users.token);
  const schedules = useSelector((state: ReduxState) => state.schedules.schedules);
  const availability = useSelector((state: ReduxState) => state.schedules.availability);
  const isGettingAvailability = useSelector((state: ReduxState) => state.schedules.isGettingAvailability);
  const isUpdatingSchedule = useSelector((state: ReduxState) => state.schedules.isUpdatingSchedule);
  const isDeletingSchedule = useSelector((state: ReduxState) => state.schedules.isDeletingSchedule);

  const [visibleDate, setVisibleDate] = React.useState<Date>(new Date());
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const [editable, setEditable] = React.useState<boolean>(false);
  const [excludedDates, setExcludedDates] = React.useState<string[]>([]);
  const [assignments, setAssignments] = React.useState<Schedule["assignments"]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState<boolean>(false);

  const savedSchedule = React.useMemo(() => schedules.find((schedule) => schedule._id === schedule_id), [
    schedule_id,
    schedules
  ]);
  const schedule = React.useMemo(
    () =>
      savedSchedule
        ? {
            ...savedSchedule,
            excludedDates
          }
        : undefined,
    [excludedDates, savedSchedule]
  );
  const scheduleStart = React.useMemo(() => moment(schedule?.startDate), [schedule?.startDate]);
  const scheduleStartDate = React.useMemo(() => scheduleStart.toDate(), [scheduleStart]);

  const scheduleAvailability = React.useMemo(
    () => availability.filter((_availability) => _availability.schedule_id === schedule_id) ?? [],
    [availability, schedule_id]
  );

  const legendEvents = React.useMemo(() => {
    const dayBeforeStart = scheduleStart.subtract(scheduleStart.day(), "day").toDate();

    const events: CalendarEvent[] = [
      {
        title: "Chief",
        user_id: "",
        chief: true,
        certified: true,
        start: dayBeforeStart,
        end: dayBeforeStart,
        allDay: true
      },
      {
        title: "Certified",
        user_id: "",
        chief: false,
        certified: true,
        start: dayBeforeStart,
        end: dayBeforeStart,
        allDay: true
      },
      {
        title: "Regular",
        user_id: "",
        chief: false,
        certified: false,
        start: dayBeforeStart,
        end: dayBeforeStart,
        allDay: true
      }
    ];

    return events;
  }, [scheduleStart]);

  const availabilityEvents = React.useMemo(() => {
    if (!schedule) return [];

    let events: CalendarEvent[] = [];

    for (const availability of scheduleAvailability) {
      const cadet = cadets.find((cadet) => cadet._id === availability.user_id);

      events = events.concat(
        availability.days
          .filter((day) => isDayValid(schedule, day))
          .map((day) => {
            const date = moment(day).toDate();

            return {
              title: cadet?.name ?? "Unknown",
              user_id: availability.user_id,
              chief: cadet?.chief ?? false,
              certified: cadet?.certified ?? false,
              start: date,
              end: date,
              allDay: true
            };
          })
      );
    }

    return [...legendEvents, ...events.sort(compareEvents)];
  }, [cadets, legendEvents, schedule, scheduleAvailability]);

  const scheduleEvents = React.useMemo(() => {
    let events: CalendarEvent[] = [];

    for (const assignment of assignments) {
      const date = moment(assignment.date).toDate();

      if (schedule && isDayValid(schedule, date)) {
        events = events.concat(
          assignment.cadet_ids.map((cadet_id) => {
            const cadet = cadets.find((cadet) => cadet._id === cadet_id);

            return {
              title: cadet?.name ?? "Unknown",
              user_id: cadet_id,
              chief: cadet?.chief ?? false,
              certified: cadet?.certified ?? false,
              start: date,
              end: date,
              allDay: true
            };
          })
        );
      }
    }

    return [...legendEvents, ...events];
  }, [assignments, cadets, legendEvents, schedule]);

  const noModifications = React.useMemo(() => {
    return (
      editable === schedule?.editable &&
      JSON.stringify(savedSchedule?.excludedDates) === JSON.stringify(schedule?.excludedDates) &&
      JSON.stringify(assignments.sort(compareScheduleDay)) ===
        JSON.stringify(schedule?.assignments.sort(compareScheduleDay))
    );
  }, [
    assignments,
    editable,
    savedSchedule?.excludedDates,
    schedule?.assignments,
    schedule?.editable,
    schedule?.excludedDates
  ]);

  const dispatch = useDispatch();
  const dispatchGetAvailabilityForSchedule = React.useCallback(
    () => user?.admin && dispatch(_schedules.getAvailability(token, { schedule_id })),
    [dispatch, schedule_id, token, user?.admin]
  );
  const dispatchUpdateSchedule = React.useCallback(
    () =>
      dispatch(
        _schedules.updateSchedule(token, schedule_id, {
          editable,
          excludedDates,
          assignments
        })
      ),
    [assignments, dispatch, editable, excludedDates, schedule_id, token]
  );
  const dispatchDeleteSchedule = React.useCallback(() => dispatch(_schedules.deleteSchedule(token, schedule_id)), [
    dispatch,
    schedule_id,
    token
  ]);

  const onClickBuildSchedule = React.useCallback(() => {
    if (!schedule) {
      return;
    }

    const newSchedule = buildSchedule(schedule, cadets, availability);

    setAssignments(newSchedule.assignments);
  }, [availability, cadets, schedule]);

  const dayPropGetter = React.useCallback(
    (date: Date) => {
      if (schedule && !isDayValid(schedule, date)) {
        return {
          style: {
            backgroundColor: "#ECECED"
          }
        };
      }

      return {};
    },
    [schedule]
  );

  const eventPropGetter = React.useCallback(
    (event) => ({
      style: event.chief
        ? {
            backgroundColor: "#F48FB1"
          }
        : event.certified
        ? {
            backgroundColor: "#90CAF9"
          }
        : undefined
    }),
    []
  );

  const handleDayClick = React.useCallback(
    (value: { start: string | Date }) => {
      const dateMoment = moment(value.start);
      const dayOfWeek = dateMoment.day();
      const date = dateMoment.format("YYYY-MM-DD");

      if (
        dateMoment.isBetween(schedule?.startDate, schedule?.endDate, "day", "[]") &&
        dayOfWeek !== 0 &&
        dayOfWeek !== 6
      ) {
        setExcludedDates((prevExcludedDates) =>
          prevExcludedDates.includes(date)
            ? prevExcludedDates.filter((thisDate) => thisDate !== date)
            : [...prevExcludedDates, date]
        );
      }
    },
    [schedule?.endDate, schedule?.startDate]
  );

  /**
   * Refresh the availability of the given schedule
   */
  React.useEffect(() => {
    if (token) {
      dispatchGetAvailabilityForSchedule();
    }
  }, [dispatchGetAvailabilityForSchedule, token]);

  React.useEffect(() => {
    setAssignments(schedule?.assignments ?? []);
  }, [schedule?.assignments]);

  React.useEffect(() => {
    setExcludedDates(savedSchedule?.excludedDates ?? []);
  }, [savedSchedule?.excludedDates]);

  React.useEffect(() => {
    setEditable(schedule?.editable ?? false);
  }, [schedule?.editable]);

  React.useEffect(() => {
    setVisibleDate(scheduleStartDate);
  }, [scheduleStartDate]);

  if (!user?.admin) {
    return (
      <div className={classes.root}>
        <Grid container direction="row" alignItems="center">
          <Typography variant="h6">Schedule for {schedule?.name}</Typography>
          {schedule?.editable ? (
            <Tooltip title="This schedule is still accepting responses">
              <LockOpenIcon fontSize="small" color="secondary" />
            </Tooltip>
          ) : (
            <Tooltip title="This schedule is not accepting responses">
              <LockIcon fontSize="small" color="secondary" />
            </Tooltip>
          )}
        </Grid>

        <Paper className={classes.paper}>
          <div className={classes.calendarContainer}>
            <Calendar
              localizer={localizer}
              defaultView="month"
              views={["month"]}
              showAllEvents
              date={visibleDate}
              onNavigate={(newDate) => setVisibleDate(newDate)}
              events={scheduleEvents}
              dayPropGetter={dayPropGetter}
              eventPropGetter={eventPropGetter}
              style={{ width: "100%", height: 800 }}
            />
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paperTabs}>
        <Tabs variant="fullWidth" value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
          <Tab label="View/Manage Schedule" />
          <Tab label="View Availability" />
        </Tabs>
      </Paper>

      {tabIndex === 0 && (
        <React.Fragment>
          <Grid container direction="row" alignItems="center">
            <Typography variant="h6">View/manage schedule for {schedule?.name}</Typography>
            {schedule?.editable ? (
              <Tooltip title="This schedule is still accepting responses">
                <LockOpenIcon fontSize="small" color="secondary" />
              </Tooltip>
            ) : (
              <Tooltip title="This schedule is not accepting responses">
                <LockIcon fontSize="small" color="secondary" />
              </Tooltip>
            )}
          </Grid>
          <Typography variant="body2">
            When you are ready to generate a schedule, you should lock the schedule so that cadets can't change their
            availability after. You can generate a schedule automatically that will take into account the cadet
            requirements as well as attempt to give cadets as close to even assignments as possible. If you are not
            satisfied with the schedule you can generate a new one. As a warning, generating a schedule can take some
            time, please do not navigate away while a schedule is being generated. If you are satisfied with a schedule,
            you can save it, if not you can clear the changes below the calendar.
          </Typography>

          <Grid className={classes.paddedGrid} container direction="row" alignItems="flex-start">
            <Tooltip title="Warning: this can take some time to complete">
              <div>
                <Button
                  className={classes.paddedButton}
                  variant="contained"
                  color="secondary"
                  startIcon={<AssignmentIndIcon />}
                  disabled={isGettingAvailability || isUpdatingSchedule || isDeletingSchedule}
                  onClick={onClickBuildSchedule}
                >
                  Build Schedule
                </Button>
              </div>
            </Tooltip>

            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel
                control={<Checkbox checked={editable} onChange={(e) => setEditable(e.target.checked)} />}
                label="Editable"
              />
            </FormGroup>
          </Grid>

          <Paper className={classes.paper}>
            <div className={classes.calendarContainer}>
              <Calendar
                localizer={localizer}
                defaultView="month"
                views={["month"]}
                showAllEvents
                selectable
                date={visibleDate}
                onNavigate={(newDate) => setVisibleDate(newDate)}
                events={scheduleEvents}
                dayPropGetter={dayPropGetter}
                eventPropGetter={eventPropGetter}
                onSelectSlot={handleDayClick}
                style={{ width: "100%", height: 800 }}
              />
            </div>
          </Paper>

          <Button
            className={classes.clearButton}
            color="secondary"
            disabled={noModifications}
            onClick={() => {
              setExcludedDates(savedSchedule?.excludedDates ?? []);
              setAssignments(schedule?.assignments ?? []);
              setEditable(schedule?.editable ?? false);
            }}
          >
            Clear Changes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={
              isUpdatingSchedule ? (
                <CircularProgress className={classes.spinner} color="inherit" size={16} />
              ) : (
                <SaveIcon />
              )
            }
            disabled={noModifications || isGettingAvailability || isUpdatingSchedule || isDeletingSchedule}
            onClick={dispatchUpdateSchedule}
          >
            Save Changes
          </Button>

          <IconButton disabled={isUpdatingSchedule || isDeletingSchedule} onClick={() => setShowDeleteDialog(true)}>
            <DeleteIcon />
          </IconButton>

          <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
            <DialogTitle>Delete {schedule?.name}?</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete the schedule?</DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button color="secondary" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                  dispatchDeleteSchedule();
                  history.push("/profile");
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}

      {tabIndex === 1 && (
        <React.Fragment>
          <Grid container direction="row" alignItems="center">
            <Typography variant="h6">Everyone's availability for {schedule?.name}</Typography>
            {schedule?.editable ? (
              <Tooltip title="This schedule is still accepting responses">
                <LockOpenIcon fontSize="small" color="secondary" />
              </Tooltip>
            ) : (
              <Tooltip title="This schedule is not accepting responses">
                <LockIcon fontSize="small" color="secondary" />
              </Tooltip>
            )}
          </Grid>
          <Typography variant="body2">
            If a cadet's availability is missing, you should remind them they need to add their availability before you
            can generate a schedule. If a cadet has no availability listed below, they will not be included in the
            generated schedule.
          </Typography>

          <Paper className={classes.paper}>
            <div className={classes.calendarContainer}>
              <Calendar
                localizer={localizer}
                defaultView="month"
                views={["month"]}
                showAllEvents
                date={visibleDate}
                onNavigate={(newDate) => setVisibleDate(newDate)}
                events={availabilityEvents}
                dayPropGetter={dayPropGetter}
                eventPropGetter={eventPropGetter}
                style={{ width: "100%", height: 800 }}
              />
            </div>
          </Paper>
        </React.Fragment>
      )}
    </div>
  );
};

export default SchedulePage;
