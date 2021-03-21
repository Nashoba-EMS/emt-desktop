import React from "react";
import moment from "moment";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { ReduxState } from "../redux";
import { _schedules } from "../redux/actions";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    calendarContainer: {}
  })
);

const localizer = momentLocalizer(moment);

const AvailabilityPage: React.FC = () => {
  const classes = useStyles();

  const { schedule_id } = useParams<{ schedule_id: string }>();

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);
  const availability = useSelector((state: ReduxState) => state.schedules.availability);

  const dispatch = useDispatch();
  const dispatchGetAvailabilityForScheduleAndUser = React.useCallback(
    () => dispatch(_schedules.getAvailability(token, { schedule_id, user_id: user?._id })),
    [dispatch, schedule_id, token, user?._id]
  );

  /**
   * Refresh the availability of the given user
   */
  React.useEffect(() => {
    if (token) {
      dispatchGetAvailabilityForScheduleAndUser();
    }
  }, [dispatchGetAvailabilityForScheduleAndUser, token]);

  // TODO: render either a first and last day indicator
  // or disable days outside of the range

  return (
    <div className={classes.root}>
      <div className={classes.calendarContainer}>
        <Calendar
          localizer={localizer}
          defaultView="month"
          views={["month"]}
          selectable
          showAllEvents
          events={[
            {
              title: "Available",
              start: new Date(),
              end: new Date(),
              allDay: true
            }
          ]}
          tooltipAccessor={() => "Click to toggle availability"}
          onSelectEvent={(event) => console.log(event)}
          onSelectSlot={(slot) => console.log(slot)}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.title === "Available" ? "#90C290" : "#A07178"
            }
          })}
          style={{ width: "100%", height: 800 }}
        />
      </div>
    </div>
  );
};

export default AvailabilityPage;
