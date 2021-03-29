import React from "react";
import moment from "moment";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import SaveIcon from "@material-ui/icons/Save";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { ReduxState } from "../redux";
import { _schedules } from "../redux/actions";
import { getDaysInSchedule, isDayValid } from "../utils/datetime";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      paddingBottom: theme.spacing(2)
    },
    paddedButton: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1)
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

const AvailabilityPage: React.FC = () => {
  const classes = useStyles();

  const { schedule_id } = useParams<{ schedule_id: string }>();

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);
  const schedules = useSelector((state: ReduxState) => state.schedules.schedules);
  const availability = useSelector((state: ReduxState) => state.schedules.availability);
  const isGettingAvailability = useSelector((state: ReduxState) => state.schedules.isGettingAvailability);
  const isCreatingAvailability = useSelector((state: ReduxState) => state.schedules.isCreatingAvailability);

  const [visibleDate, setVisibleDate] = React.useState<Date>(new Date());
  const [newAvailability, setNewAvailability] = React.useState<string[]>([]);

  const schedule = React.useMemo(() => schedules.find((schedule) => schedule._id === schedule_id), [
    schedule_id,
    schedules
  ]);
  const scheduleStart = React.useMemo(() => moment(schedule?.startDate), [schedule?.startDate]);
  const scheduleEnd = React.useMemo(() => moment(schedule?.endDate), [schedule?.endDate]);
  const scheduleStartDate = React.useMemo(() => scheduleStart.toDate(), [scheduleStart]);

  const userAvailability = React.useMemo(
    () =>
      availability.find(
        (_availability) => _availability.schedule_id === schedule_id && _availability.user_id === user?._id
      ),
    [availability, schedule_id, user?._id]
  );

  const events = React.useMemo(
    () =>
      schedule
        ? newAvailability
            .filter((day) => isDayValid(schedule, day))
            .map((day) => {
              const date = moment(day).toDate();

              return {
                title: "Available",
                start: date,
                end: date,
                allDay: true
              };
            })
        : [],
    [newAvailability, schedule]
  );

  const noModifications = React.useMemo(() => {
    return JSON.stringify(newAvailability.sort()) === JSON.stringify(userAvailability?.days.sort());
  }, [newAvailability, userAvailability?.days]);

  const dispatch = useDispatch();
  const dispatchGetAvailabilityForScheduleAndUser = React.useCallback(
    () => dispatch(_schedules.getAvailability(token, { schedule_id, user_id: user?._id })),
    [dispatch, schedule_id, token, user?._id]
  );
  const dispatchCreateAvailability = React.useCallback(
    () =>
      dispatch(
        _schedules.createAvailability(
          token,
          { schedule_id, user_id: user?._id ?? "" },
          {
            schedule_id,
            user_id: user?._id ?? "",
            days: newAvailability
          }
        )
      ),
    [dispatch, newAvailability, schedule_id, token, user?._id]
  );

  const dayPropGetter = React.useCallback(
    (date: Date) => {
      if (schedule && !isDayValid(schedule, date)) {
        return {
          style: {
            backgroundColor: "#ECECED"
          }
        };
      }

      return {
        className: classes.calendarDay
      };
    },
    [classes.calendarDay, schedule]
  );

  const eventPropGetter = React.useCallback(
    (event) =>
      event.title === "Available"
        ? {}
        : {
            style: {
              backgroundColor: "#F48FB1"
            }
          },
    []
  );

  const handleDayClick = React.useCallback(
    (value: { start: string | Date }) => {
      const date = moment(value.start).format("YYYY-MM-DD");

      if (schedule && isDayValid(schedule, date)) {
        setNewAvailability((prevAvailability) =>
          prevAvailability.includes(date)
            ? prevAvailability.filter((_date) => _date !== date)
            : [...prevAvailability, date]
        );
      }
    },
    [schedule]
  );

  const onClickAddAll = React.useCallback(() => {
    if (!schedule) {
      return;
    }

    const daysInSchedule = getDaysInSchedule(schedule);

    setNewAvailability(daysInSchedule);
  }, [schedule]);

  const onClickRemoveAll = React.useCallback(() => {
    setNewAvailability([]);
  }, []);

  const tooltipAccessor = React.useCallback(() => "Click on a day to toggle your availability", []);

  /**
   * Refresh the availability of the given user
   */
  React.useEffect(() => {
    if (token) {
      dispatchGetAvailabilityForScheduleAndUser();
    }
  }, [dispatchGetAvailabilityForScheduleAndUser, token]);

  React.useEffect(() => {
    if (schedule) {
      setNewAvailability(userAvailability?.days.filter((day) => isDayValid(schedule, day)) ?? []);
    }
  }, [schedule, userAvailability]);

  React.useEffect(() => {
    setVisibleDate(scheduleStartDate);
  }, [scheduleStartDate]);

  return (
    <div className={classes.root}>
      <Typography variant="h6">Edit your availability for {schedule?.name}</Typography>
      <Typography variant="body2">Click on a day in the calendar to toggle your availability</Typography>

      <Button
        className={classes.paddedButton}
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        disabled={isGettingAvailability || isCreatingAvailability}
        onClick={onClickAddAll}
      >
        Add All
      </Button>
      <Button
        className={classes.paddedButton}
        variant="contained"
        color="secondary"
        startIcon={<RemoveIcon />}
        disabled={isGettingAvailability || isCreatingAvailability}
        onClick={onClickRemoveAll}
      >
        Remove All
      </Button>

      <Paper className={classes.paper}>
        <div className={classes.calendarContainer}>
          <Calendar
            localizer={localizer}
            defaultView="month"
            views={["month"]}
            selectable
            date={visibleDate}
            onNavigate={(newDate) => setVisibleDate(newDate)}
            events={events}
            tooltipAccessor={tooltipAccessor}
            dayPropGetter={dayPropGetter}
            eventPropGetter={eventPropGetter}
            onSelectEvent={handleDayClick}
            onSelectSlot={handleDayClick}
            style={{ width: "100%", height: 800 }}
          />
        </div>
      </Paper>

      <Button
        className={classes.clearButton}
        color="secondary"
        disabled={noModifications}
        onClick={() => setNewAvailability(userAvailability?.days ?? [])}
      >
        Clear Changes
      </Button>
      <Button
        variant="contained"
        color="secondary"
        startIcon={
          isCreatingAvailability ? (
            <CircularProgress className={classes.spinner} color="inherit" size={16} />
          ) : (
            <SaveIcon />
          )
        }
        disabled={noModifications || isGettingAvailability || isCreatingAvailability}
        onClick={dispatchCreateAvailability}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default AvailabilityPage;
