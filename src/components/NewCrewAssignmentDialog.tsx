import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";

import { ReduxState } from "../redux";
import { CrewAssignmentWithoutId } from "../api/crews.d";

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
    boldText: {
      marginLeft: theme.spacing(1),
      fontWeight: "bold"
    },
    spinner: {
      marginLeft: 2,
      marginRight: 2
    }
  })
);

const NewCrewAssignmentDialog: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const classes = useStyles();

  const token = useSelector((state: ReduxState) => state.users.token);
  const isCreatingCrew = false;

  const [crewPayload, setCrewPayload] = React.useState<CrewAssignmentWithoutId>({
    name: "",
    crews: []
  });

  const nameIsValid = React.useMemo(() => crewPayload.name.length > 1, [crewPayload.name]);

  const canSave = React.useMemo(() => nameIsValid, [nameIsValid]);

  const dispatch = useDispatch();
  const dispatchCreateNewUser = React.useCallback(() => console.log("TODO"), []);

  return (
    <Dialog open={true} onClose={() => !isCreatingCrew && onClose()}>
      <DialogTitle>Add a new crew assignment</DialogTitle>
      <DialogContent>
        <DialogContentText>A crew assignment lists which cadets are on each crew.</DialogContentText>
        <Grid container direction="row" alignItems="flex-start">
          <TextField
            className={classes.leftField}
            margin="dense"
            variant="filled"
            label="Name"
            required
            helperText="Pick a unique name to identify the crew assignment"
            error={!nameIsValid}
            value={crewPayload.name}
            onChange={(e) => setCrewPayload({ ...crewPayload, name: e.target.value })}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button disabled={isCreatingCrew} onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          disabled={!canSave || isCreatingCrew}
          onClick={dispatchCreateNewUser}
          color="secondary"
          variant="contained"
          startIcon={
            isCreatingCrew ? <CircularProgress className={classes.spinner} color="inherit" size={16} /> : <SaveIcon />
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewCrewAssignmentDialog;
