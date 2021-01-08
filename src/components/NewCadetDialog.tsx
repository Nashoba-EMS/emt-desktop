import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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
import { UserOptionalPassword, UserWithoutId } from "../api/users.d";
import { _users } from "../redux/actions";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../constants/users";

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
      fontWeight: "bold",
      color: theme.palette.secondary.main
    },
    spinner: {
      marginLeft: 2,
      marginRight: 2
    }
  })
);

const NewCadetDialog: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const classes = useStyles();

  const token = useSelector((state: ReduxState) => state.users.token);
  const isCreatingUser = useSelector((state: ReduxState) => state.users.isCreatingUser);
  const latestCadet = useSelector((state: ReduxState) => state.users.latestCadet);

  const [latestCadetOnLoad, setLatestCadetOnLoad] = React.useState<UserOptionalPassword | null | undefined>();
  const [userCreated, setUserCreated] = React.useState<boolean>(false);

  const [userPayload, setUserPayload] = React.useState<UserWithoutId>({
    name: "",
    email: "",
    password: "",
    admin: false,
    birthdate: "",
    eligible: false,
    certified: false,
    availability: []
  });

  const nameIsValid = React.useMemo(() => userPayload.name.length > 1 && userPayload.name.includes(" "), [
    userPayload.name
  ]);
  const emailIsValid = React.useMemo(
    () => userPayload.email.includes("@") && userPayload.email.includes(".") && userPayload.email.length >= 5,
    [userPayload.email]
  );
  const birthdateIsValid = React.useMemo(() => userPayload.birthdate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/), [
    userPayload.birthdate
  ]);
  const passwordIsValid = React.useMemo(
    () =>
      userPayload.password === "" ||
      (userPayload.password.length >= MIN_PASSWORD_LENGTH && userPayload.password.length <= MAX_PASSWORD_LENGTH),
    [userPayload.password]
  );

  const canSave = React.useMemo(() => nameIsValid && emailIsValid && birthdateIsValid && passwordIsValid, [
    birthdateIsValid,
    emailIsValid,
    nameIsValid,
    passwordIsValid
  ]);

  const dispatch = useDispatch();
  const dispatchCreateNewUser = React.useCallback(
    () => dispatch(_users.createUser(token, userPayload.email, userPayload)),
    [dispatch, token, userPayload]
  );

  /**
   * Detect if a user was created
   */
  React.useEffect(() => {
    if (latestCadetOnLoad === undefined) {
      setLatestCadetOnLoad(latestCadet);
    } else if (latestCadet?._id !== latestCadetOnLoad?._id) {
      setUserCreated(true);
    }
  }, [latestCadet, latestCadetOnLoad]);

  return (
    <Dialog open={true} onClose={() => !isCreatingUser && onClose()}>
      {userCreated ? (
        <React.Fragment>
          <DialogTitle>Review created cadet</DialogTitle>
          <DialogContent>
            <DialogContentText>
              A cadet was created with the following credentials. Please save these and send them to the appropriate
              cadet so they can sign in as you will not be able to view them again. You will need to generate a new
              password if you forget to send it to them.
            </DialogContentText>

            <Grid container direction="row" alignItems="flex-start">
              <Typography>Email: </Typography>
              <Typography className={classes.boldText}>{latestCadet?.email ?? ""}</Typography>
            </Grid>

            <Grid container direction="row" alignItems="flex-start">
              <Typography>Password: </Typography>
              <Typography className={classes.boldText}>{latestCadet?.password ?? ""}</Typography>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary" variant="contained">
              Done
            </Button>
          </DialogActions>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <DialogTitle>Add a new cadet</DialogTitle>
          <DialogContent>
            <DialogContentText>
              After you add a new cadet to the system, you should tell them what email and password to use. They will be
              able to change their password after signing in.
            </DialogContentText>
            <Grid container direction="row" alignItems="flex-start">
              <TextField
                className={classes.leftField}
                margin="dense"
                variant="filled"
                label="Name"
                required
                helperText="This should be their full name"
                error={!nameIsValid}
                value={userPayload.name}
                onChange={(e) => setUserPayload({ ...userPayload, name: e.target.value })}
              />
              <TextField
                className={classes.rightField}
                margin="dense"
                variant="filled"
                fullWidth
                label="Birthdate"
                required
                helperText="Must use the format: YYYY-MM-DD"
                error={!birthdateIsValid}
                value={userPayload.birthdate}
                onChange={(e) => setUserPayload({ ...userPayload, birthdate: e.target.value })}
              />
            </Grid>
            <Grid container direction="row" alignItems="flex-start">
              <TextField
                className={classes.leftField}
                margin="dense"
                variant="filled"
                label="Email"
                type="email"
                required
                helperText="Recommended to pick school email for consistency"
                error={!emailIsValid}
                value={userPayload.email}
                onChange={(e) => setUserPayload({ ...userPayload, email: e.target.value.toLowerCase() })}
              />
              <TextField
                className={classes.rightField}
                margin="dense"
                variant="filled"
                fullWidth
                label="Password"
                helperText={`Leave blank to generate a random one. If manually set, must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`}
                error={!passwordIsValid}
                value={userPayload.password}
                onChange={(e) => setUserPayload({ ...userPayload, password: e.target.value })}
              />
            </Grid>
            <Grid container direction="row" alignItems="flex-start">
              <Grid className={classes.leftField}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userPayload.eligible}
                      onChange={(e) => setUserPayload({ ...userPayload, eligible: e.target.checked })}
                    />
                  }
                  label="Eligible"
                />
                <FormHelperText>Eligible means they should be assigned to crews.</FormHelperText>
              </Grid>
              <Grid className={classes.centerField}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userPayload.certified}
                      onChange={(e) => setUserPayload({ ...userPayload, certified: e.target.checked })}
                    />
                  }
                  label="Certified"
                />
                <FormHelperText>Certified means they have passed the certification requirements.</FormHelperText>
              </Grid>
              <Grid className={classes.rightField}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userPayload.admin}
                      onChange={(e) => setUserPayload({ ...userPayload, admin: e.target.checked })}
                    />
                  }
                  label="Admin"
                />
                <FormHelperText>Admins can manage schedules and cadets.</FormHelperText>
              </Grid>
            </Grid>
            <DialogActions>
              <Button disabled={isCreatingUser} onClick={onClose} color="secondary">
                Cancel
              </Button>
              <Button
                disabled={!canSave || isCreatingUser}
                onClick={dispatchCreateNewUser}
                color="secondary"
                variant="contained"
                startIcon={
                  isCreatingUser ? (
                    <CircularProgress className={classes.spinner} color="inherit" size={16} />
                  ) : (
                    <SaveIcon />
                  )
                }
              >
                Save
              </Button>
            </DialogActions>
          </DialogContent>
        </React.Fragment>
      )}
    </Dialog>
  );
};

export default NewCadetDialog;
