import React from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

import { ReduxState } from "../redux";
import { _schedules } from "../redux/actions";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex"
    }
  })
);

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

  return <React.Fragment />;
};

export default AvailabilityPage;
