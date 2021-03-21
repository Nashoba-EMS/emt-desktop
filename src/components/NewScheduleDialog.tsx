import React from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";

import { ReduxState } from "../redux";
import { ScheduleWithoutId } from "../api/schedules.d";
import { _schedules } from "../redux/actions";
import { isDateStringValid } from "../utils/datetime";

const useStyles = makeStyles((theme) =>
  createStyles({
    leftField: {
      flex: 1,
      marginRight: theme.spacing(1)
    },
    centerField: {
      flex: 1,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    rightField: {
      flex: 1,
      marginLeft: theme.spacing(1)
    },
    flexField: {
      flex: 1
    },
    spinner: {
      marginLeft: 2,
      marginRight: 2
    }
  })
);

const NewScheduleDialog: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const classes = useStyles();

  const token = useSelector((state: ReduxState) => state.users.token);
  const isCreatingSchedule = useSelector((state: ReduxState) => state.schedules.isCreatingSchedule);

  const [schedulePayload, setSchedulePayload] = React.useState<ScheduleWithoutId>({
    name: "",
    startDate: "",
    endDate: "",
    editable: true,
    assignments: []
  });
  const [startedCreation, setStartedCreation] = React.useState<boolean>(false);

  const nameIsValid = React.useMemo(() => schedulePayload.name.trim().length > 1, [schedulePayload.name]);
  const startDateIsValid = React.useMemo(() => isDateStringValid(schedulePayload.startDate), [
    schedulePayload.startDate
  ]);
  const endDateIsValid = React.useMemo(() => isDateStringValid(schedulePayload.endDate), [schedulePayload.endDate]);

  const startDateAsMoment = React.useMemo(
    () => (schedulePayload.startDate !== "" ? moment(schedulePayload.startDate) : null),
    [schedulePayload.startDate]
  );
  const endDateAsMoment = React.useMemo(
    () => (schedulePayload.endDate !== "" ? moment(schedulePayload.endDate) : null),
    [schedulePayload.endDate]
  );
  const endDateIsAfterStartDate = React.useMemo(() => startDateAsMoment?.isSameOrBefore(endDateAsMoment), [
    endDateAsMoment,
    startDateAsMoment
  ]);

  const canSave = React.useMemo(() => nameIsValid && startDateIsValid && endDateIsValid && endDateIsAfterStartDate, [
    endDateIsAfterStartDate,
    endDateIsValid,
    nameIsValid,
    startDateIsValid
  ]);

  const dispatch = useDispatch();
  const dispatchCreateNewSchedule = React.useCallback(
    () => dispatch(_schedules.createSchedule(token, schedulePayload)),
    [dispatch, schedulePayload, token]
  );

  React.useEffect(() => {
    if (isCreatingSchedule) {
      setStartedCreation(true);
    } else if (startedCreation) {
      onClose();
    }
  }, [isCreatingSchedule, onClose, startedCreation]);

  return (
    <Dialog open={true} onClose={() => !isCreatingSchedule && onClose()}>
      <form>
        <DialogTitle>Add a new schedule</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A schedule allows each cadet to input their availability in a given range of dates. Once a schedule is
            created, you cannot change the start and end dates. After a schedule is created, cadets can fill out their
            availability for the given month. Once all the cadets have provided their availability, you can generate a
            valid assignment of cadets for each day.
          </DialogContentText>
          <Grid container direction="row" alignItems="flex-start">
            <TextField
              className={classes.leftField}
              margin="dense"
              variant="filled"
              label="Name"
              required
              helperText='This is the visible name on the schedule. For instance "April 2021"'
              autoFocus
              error={!nameIsValid}
              value={schedulePayload.name}
              onChange={(e) =>
                setSchedulePayload((prevSchedulePayload) => ({
                  ...prevSchedulePayload,
                  name: e.target.value
                }))
              }
            />

            <Grid className={classes.rightField}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={schedulePayload.editable}
                    onChange={(e) =>
                      setSchedulePayload((prevSchedulePayload) => ({
                        ...prevSchedulePayload,
                        editable: e.target.checked
                      }))
                    }
                  />
                }
                label="Editable"
              />
              <FormHelperText>Check this box to allow users to input their availability.</FormHelperText>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="flex-start">
            <KeyboardDatePicker
              className={classes.leftField}
              disableToolbar
              variant="inline"
              inputVariant="filled"
              format="MM/DD/YYYY"
              margin="dense"
              id="start-date-picker"
              label="First Date"
              helperText="The first day of the schedule. Usually the first day of the month."
              error={!startDateIsValid}
              value={startDateAsMoment}
              onChange={(date) => {
                setSchedulePayload((prevSchedulePayload) => ({
                  ...prevSchedulePayload,
                  startDate: date?.isValid() ? date.format("YYYY-MM-DD") : ""
                }));
              }}
            />
            <KeyboardDatePicker
              className={classes.rightField}
              disableToolbar
              variant="inline"
              inputVariant="filled"
              format="MM/DD/YYYY"
              margin="dense"
              id="end-date-picker"
              label="Last Date"
              helperText="The last day of the schedule. Usually the last day of the month."
              error={!endDateIsValid || !endDateIsAfterStartDate}
              value={endDateAsMoment}
              onChange={(date) => {
                setSchedulePayload((prevSchedulePayload) => ({
                  ...prevSchedulePayload,
                  endDate: date?.isValid() ? date.format("YYYY-MM-DD") : ""
                }));
              }}
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button disabled={isCreatingSchedule} onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            startIcon={
              isCreatingSchedule ? (
                <CircularProgress className={classes.spinner} color="inherit" size={16} />
              ) : (
                <SaveIcon />
              )
            }
            disabled={!canSave || isCreatingSchedule}
            onClick={(event) => {
              // Prevent page refresh
              event.preventDefault();

              dispatchCreateNewSchedule();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewScheduleDialog;
