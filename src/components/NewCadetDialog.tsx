import React from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";

import { ReduxState } from "../redux";
import { User, UserOptionalPassword, UserWithoutId } from "../api/users.d";
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
      fontWeight: "bold"
    },
    spinner: {
      marginLeft: 2,
      marginRight: 2
    },
    selectControl: {
      minWidth: 194,
      marginRight: theme.spacing(2)
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
    adminPassword: "",
    admin: false,
    birthdate: "",
    gender: "",
    eligible: false,
    certified: false,
    chief: false,
    cohort: "",
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
  const genderIsValid = React.useMemo(() => userPayload.gender !== "", [userPayload.gender]);
  const passwordIsValid = React.useMemo(
    () =>
      userPayload.password === "" ||
      (userPayload.password.length >= MIN_PASSWORD_LENGTH && userPayload.password.length <= MAX_PASSWORD_LENGTH),
    [userPayload.password]
  );

  const birthdateAsMoment = React.useMemo(() => (userPayload.birthdate !== "" ? moment(userPayload.birthdate) : null), [
    userPayload.birthdate
  ]);

  const canSave = React.useMemo(
    () => nameIsValid && emailIsValid && birthdateIsValid && genderIsValid && passwordIsValid,
    [birthdateIsValid, emailIsValid, genderIsValid, nameIsValid, passwordIsValid]
  );

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
              <Typography className={classes.boldText} color="secondary">
                {latestCadet?.email ?? ""}
              </Typography>
            </Grid>

            <Grid container direction="row" alignItems="flex-start">
              <Typography>Password: </Typography>
              <Typography className={classes.boldText} color="secondary">
                {latestCadet?.password ?? ""}
              </Typography>
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
                helperText="This should be their first and last name"
                autoFocus
                error={!nameIsValid}
                value={userPayload.name}
                onChange={(e) =>
                  setUserPayload((prevUserPayload) => ({
                    ...prevUserPayload,
                    name: e.target.value
                  }))
                }
              />
              <KeyboardDatePicker
                className={classes.rightField}
                disableToolbar
                variant="inline"
                inputVariant="filled"
                format="MM/DD/YYYY"
                margin="dense"
                id="new-cadet-birthdate-picker"
                label="Birth Date"
                helperText="Format: MM/DD/YYYY"
                error={!birthdateIsValid}
                value={birthdateAsMoment}
                onChange={(date) => {
                  setUserPayload((prevUserPayload) => ({
                    ...prevUserPayload,
                    birthdate: date?.isValid() ? date.format("YYYY-MM-DD") : ""
                  }));
                }}
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
                onChange={(e) =>
                  setUserPayload((prevUserPayload) => ({
                    ...prevUserPayload,
                    email: e.target.value.toLowerCase()
                  }))
                }
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
                onChange={(e) =>
                  setUserPayload((prevUserPayload) => ({
                    ...prevUserPayload,
                    password: e.target.value,
                    adminPassword: e.target.value
                  }))
                }
              />
            </Grid>
            <Grid container direction="row" alignItems="flex-start">
              <FormControl className={classes.leftField} variant="filled" error={!genderIsValid}>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Cohort"
                  value={userPayload.gender}
                  onChange={(e) =>
                    setUserPayload((prevUserPayload) => ({
                      ...prevUserPayload,
                      gender: e.target.value as User["gender"]
                    }))
                  }
                >
                  <MenuItem value="" disabled>
                    <em>Select One</em>
                  </MenuItem>
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                  <MenuItem value="O">Other</MenuItem>
                </Select>
                <FormHelperText>Used to balance crews</FormHelperText>
              </FormControl>
              <FormControl className={classes.rightField} variant="filled">
                <InputLabel>Cohort</InputLabel>
                <Select
                  label="Cohort"
                  value={userPayload.cohort}
                  onChange={(e) =>
                    setUserPayload((prevUserPayload) => ({
                      ...prevUserPayload,
                      cohort: e.target.value as User["cohort"]
                    }))
                  }
                >
                  <MenuItem value="" disabled>
                    <em>Select One</em>
                  </MenuItem>
                  <MenuItem value="A">In Person: A</MenuItem>
                  <MenuItem value="B">In Person: B</MenuItem>
                  <MenuItem value="R">Remote</MenuItem>
                </Select>
                <FormHelperText>Used to help assign crews</FormHelperText>
              </FormControl>
            </Grid>
            <Grid container direction="row" alignItems="flex-start">
              <Grid className={classes.leftField}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userPayload.eligible}
                      onChange={(e) =>
                        setUserPayload((prevUserPayload) => ({
                          ...prevUserPayload,
                          eligible: e.target.checked
                        }))
                      }
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
                      onChange={(e) =>
                        setUserPayload((prevUserPayload) => ({
                          ...prevUserPayload,
                          certified: e.target.checked
                        }))
                      }
                    />
                  }
                  label="Certified"
                />
                <FormHelperText>Certified means they have passed the certification requirements.</FormHelperText>
              </Grid>
              <Grid className={classes.centerField}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userPayload.chief}
                      onChange={(e) =>
                        setUserPayload((prevUserPayload) => ({
                          ...prevUserPayload,
                          chief: e.target.checked
                        }))
                      }
                    />
                  }
                  label="Chief"
                />
                <FormHelperText>This cadet is a crew chief.</FormHelperText>
              </Grid>
              <Grid className={classes.rightField}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userPayload.admin}
                      onChange={(e) =>
                        setUserPayload((prevUserPayload) => ({
                          ...prevUserPayload,
                          admin: e.target.checked
                        }))
                      }
                    />
                  }
                  label="Admin"
                />
                <FormHelperText>Admins can manage schedules and cadets.</FormHelperText>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button disabled={isCreatingUser} onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="contained"
              startIcon={
                isCreatingUser ? (
                  <CircularProgress className={classes.spinner} color="inherit" size={16} />
                ) : (
                  <SaveIcon />
                )
              }
              disabled={!canSave || isCreatingUser}
              onClick={dispatchCreateNewUser}
            >
              Save
            </Button>
          </DialogActions>
        </React.Fragment>
      )}
    </Dialog>
  );
};

export default NewCadetDialog;
