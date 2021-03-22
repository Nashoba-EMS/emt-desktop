import React from "react";
import moment from "moment";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { ReduxState } from "../redux";
import { _schedules } from "../redux/actions";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%"
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

const SchedulePage: React.FC = () => {
  const classes = useStyles();

  const { schedule_id } = useParams<{ schedule_id: string }>();

  const user = useSelector((state: ReduxState) => state.users.user);
  const cadets = useSelector((state: ReduxState) => state.users.cadets);
  const token = useSelector((state: ReduxState) => state.users.token);
  const schedules = useSelector((state: ReduxState) => state.schedules.schedules);
  const availability = useSelector((state: ReduxState) => state.schedules.availability);
  const isGettingAvailability = useSelector((state: ReduxState) => state.schedules.isGettingAvailability);

  const [visibleDate, setVisibleDate] = React.useState<Date>(new Date());

  const schedule = React.useMemo(() => schedules.find((schedule) => schedule._id === schedule_id), [
    schedule_id,
    schedules
  ]);
  const scheduleStart = React.useMemo(() => moment(schedule?.startDate), [schedule?.startDate]);
  const scheduleEnd = React.useMemo(() => moment(schedule?.endDate), [schedule?.endDate]);
  const scheduleStartDate = React.useMemo(() => scheduleStart.toDate(), [scheduleStart]);

  const scheduleAvailability = React.useMemo(
    () => availability.filter((_availability) => _availability.schedule_id === schedule_id) ?? [],
    [availability, schedule_id]
  );

  const isDayValid = React.useCallback(
    (date: string | Date) => {
      const dateMoment = moment(date);
      const dayOfWeek = dateMoment.day();

      return dateMoment.isBetween(scheduleStart, scheduleEnd, "day", "[]") && dayOfWeek !== 0 && dayOfWeek !== 6;
    },
    [scheduleEnd, scheduleStart]
  );

  const events = React.useMemo(() => {
    let events: {
      title: string;
      user_id: string;
      start: Date;
      end: Date;
      allDay: true;
    }[] = [];

    for (const availability of scheduleAvailability) {
      const cadetName = cadets.find((cadet) => cadet._id === availability.user_id)?.name ?? "Unknown";

      events = events.concat(
        availability.days
          .filter((day) => isDayValid(day))
          .map((day) => {
            const date = moment(day).toDate();

            return {
              title: cadetName,
              user_id: availability.user_id,
              start: date,
              end: date,
              allDay: true
            };
          })
      );
    }

    return events;
  }, [cadets, isDayValid, scheduleAvailability]);

  const dispatch = useDispatch();
  const dispatchGetAvailabilityForSchedule = React.useCallback(
    () => user?.admin && dispatch(_schedules.getAvailability(token, { schedule_id })),
    [dispatch, schedule_id, token, user?.admin]
  );

  const dayPropGetter = React.useCallback(
    (date: Date) => {
      if (!isDayValid(date)) {
        return {
          style: {
            backgroundColor: "#ECECED"
          }
        };
      }

      return {};
    },
    [isDayValid]
  );

  const eventPropGetter = React.useCallback(
    (event) => ({
      style:
        event.user_id === user?._id
          ? {
              backgroundColor: "#F48FB1"
            }
          : undefined
    }),
    [user?._id]
  );

  /**
   * Refresh the availability of the given user
   */
  React.useEffect(() => {
    if (token) {
      dispatchGetAvailabilityForSchedule();
    }
  }, [dispatchGetAvailabilityForSchedule, token]);

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
      </div>
    );
  }

  return (
    <div className={classes.root}>
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
        If a cadet's availability is missing, you should remind them they need to add their availability before you can
        generate a schedule. If a cadet has no availability listed below, they will not be included in the generated
        schedule.
      </Typography>

      <Paper className={classes.paper}>
        <div className={classes.calendarContainer}>
          <Calendar
            localizer={localizer}
            defaultView="month"
            views={["month"]}
            selectable
            showAllEvents
            date={visibleDate}
            onNavigate={(newDate) => setVisibleDate(newDate)}
            events={events}
            dayPropGetter={dayPropGetter}
            eventPropGetter={eventPropGetter}
            style={{ width: "100%", height: 800 }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default SchedulePage;
