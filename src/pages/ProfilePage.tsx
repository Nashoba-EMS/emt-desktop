import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";

import { ReduxState } from "../redux";
import { User } from "../api/users.d";
import { _users } from "../redux/actions";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../constants/users";
import { filterUndefined } from "../utils/filter";
import { isEmpty } from "../utils/empty";
import { getAge } from "../utils/datetime";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex"
    },
    gridRoot: {
      width: "100%"
    },
    paperAuthorized: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(3)
    },
    heading: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    headingText: {},
    subheading: {
      color: theme.palette.grey[600]
    },
    controls: {
      marginTop: theme.spacing(2),
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    control: {
      marginRight: theme.spacing(2)
    },
    selectControl: {
      minWidth: 194,
      marginRight: theme.spacing(2)
    },
    checkboxContainer: {
      marginRight: theme.spacing(2)
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

const ProfilePage: React.FC = () => {
  const classes = useStyles();

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);
  const isUpdatingUser = useSelector((state: ReduxState) => state.users.isUpdatingUser);
  const latestCadet = useSelector((state: ReduxState) => state.users.latestCadet);

  const [modifications, setModifications] = React.useState<Partial<User>>({});
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const filteredModifications = React.useMemo(() => filterUndefined(modifications), [modifications]);

  const visibleName = React.useMemo(() => modifications.name ?? user?.name ?? "", [modifications.name, user?.name]);
  const visibleEmail = React.useMemo(() => modifications.email ?? user?.email ?? "", [
    modifications.email,
    user?.email
  ]);
  const visibleBirthdate = React.useMemo(() => modifications.birthdate ?? user?.birthdate ?? "", [
    modifications.birthdate,
    user?.birthdate
  ]);
  const visibleEligible = React.useMemo(() => modifications.eligible ?? user?.eligible ?? false, [
    modifications.eligible,
    user?.eligible
  ]);
  const visibleCertified = React.useMemo(() => modifications.certified ?? user?.certified ?? false, [
    modifications.certified,
    user?.certified
  ]);
  const visibleChief = React.useMemo(() => modifications.chief ?? user?.chief ?? false, [
    modifications.chief,
    user?.chief
  ]);
  const visibleCohort = React.useMemo(() => modifications.cohort ?? user?.cohort ?? "", [
    modifications.cohort,
    user?.cohort
  ]);
  const visiblePassword = React.useMemo(() => modifications.password ?? "", [modifications.password]);

  const nameIsValid = React.useMemo(() => visibleName.length > 1 && visibleName.includes(" "), [visibleName]);
  const emailIsValid = React.useMemo(
    () => visibleEmail.includes("@") && visibleEmail.includes(".") && visibleEmail.length >= 5,
    [visibleEmail]
  );
  const birthdateIsValid = React.useMemo(() => visibleBirthdate.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/), [
    visibleBirthdate
  ]);
  const passwordIsValid = React.useMemo(
    () =>
      modifications.password === undefined ||
      (modifications.password.length >= MIN_PASSWORD_LENGTH && modifications.password.length <= MAX_PASSWORD_LENGTH),
    [modifications.password]
  );
  const confirmPasswordIsValid = React.useMemo(
    () => passwordIsValid && (modifications.password === undefined || modifications.password === confirmPassword),
    [confirmPassword, modifications.password, passwordIsValid]
  );

  const canSave = React.useMemo(
    () =>
      !isEmpty(filteredModifications) &&
      nameIsValid &&
      emailIsValid &&
      birthdateIsValid &&
      passwordIsValid &&
      confirmPasswordIsValid,
    [birthdateIsValid, confirmPasswordIsValid, emailIsValid, filteredModifications, nameIsValid, passwordIsValid]
  );

  const age = React.useMemo(() => (birthdateIsValid ? getAge(visibleBirthdate) : 0), [
    birthdateIsValid,
    visibleBirthdate
  ]);

  const dispatch = useDispatch();
  const dispatchUpdateUser = React.useCallback(
    () => dispatch(_users.updateUser(token, user?.email ?? "", modifications)),
    [dispatch, modifications, token, user?.email]
  );

  /**
   * Clear changes on save
   */
  React.useEffect(() => {
    if (latestCadet?._id === user?._id) {
      setModifications({});
    }
  }, [latestCadet, user?._id]);

  return (
    <div className={classes.root}>
      <Grid className={classes.gridRoot}>
        <Paper className={classes.paperAuthorized}>
          <div className={classes.heading}>
            <Typography className={classes.headingText} variant="h6">
              Contact
            </Typography>
            <Chip label="Admin Required" color="secondary" size="small" />
          </div>

          <Grid className={classes.controls}>
            <TextField
              className={classes.control}
              variant="outlined"
              label="Name"
              disabled={!user?.admin}
              error={!nameIsValid}
              value={visibleName}
              onChange={(e) =>
                setModifications({ ...modifications, name: e.target.value === user?.name ? undefined : e.target.value })
              }
            />
            <TextField
              className={classes.control}
              variant="outlined"
              label="Email"
              disabled={!user?.admin}
              error={!emailIsValid}
              value={visibleEmail}
              onChange={(e) =>
                setModifications({
                  ...modifications,
                  email: e.target.value.toLowerCase() === user?.email ? undefined : e.target.value.toLowerCase()
                })
              }
            />
          </Grid>
        </Paper>

        <Paper className={classes.paperAuthorized}>
          <div className={classes.heading}>
            <Typography className={classes.headingText} variant="h6">
              Demographics
            </Typography>
            <Chip label="Admin Required" color="secondary" size="small" />
          </div>
          <Typography className={classes.subheading} variant="subtitle2">
            This information is used to determine crew assignments. Please contact an admin if the information is
            incorrect. Eligible cadets are ones who should be assigned to a crew. Certified must have passed the
            certification requirements for Basic EMTs.
          </Typography>

          <Grid className={classes.controls}>
            <TextField
              className={classes.control}
              variant="outlined"
              label="Birth Date"
              disabled={!user?.admin}
              error={!birthdateIsValid}
              value={visibleBirthdate}
              onChange={(e) =>
                setModifications({
                  ...modifications,
                  birthdate: e.target.value === user?.birthdate ? undefined : e.target.value
                })
              }
              helperText="Format: YYYY-MM-DD"
            />
            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel control={<Checkbox checked={age >= 18} disabled />} label="Over 18" />
              <FormHelperText>Based on birthdate</FormHelperText>
            </FormGroup>
            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleEligible}
                    disabled={!user?.admin}
                    onChange={(e) =>
                      setModifications({
                        ...modifications,
                        eligible: e.target.checked === user?.eligible ? undefined : e.target.checked
                      })
                    }
                  />
                }
                label="Eligible"
              />
              <FormHelperText>Eligible for crew placement</FormHelperText>
            </FormGroup>
            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleCertified}
                    disabled={!user?.admin}
                    onChange={(e) =>
                      setModifications({
                        ...modifications,
                        certified: e.target.checked === user?.certified ? undefined : e.target.checked
                      })
                    }
                  />
                }
                label="Certified"
              />
              <FormHelperText>Passed certifications</FormHelperText>
            </FormGroup>
            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleChief}
                    disabled={!user?.admin}
                    onChange={(e) =>
                      setModifications({
                        ...modifications,
                        chief: e.target.checked === user?.chief ? undefined : e.target.checked
                      })
                    }
                  />
                }
                label="Chief"
              />
              <FormHelperText>Crew Chief</FormHelperText>
            </FormGroup>
            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel control={<Checkbox checked={user?.admin ?? false} disabled />} label="Admin" />
              <FormHelperText>Has admin controls</FormHelperText>
            </FormGroup>
          </Grid>
        </Paper>

        <Paper className={classes.paperAuthorized}>
          <div className={classes.heading}>
            <Typography className={classes.headingText} variant="h6">
              Nashoba Cohort
            </Typography>
          </div>
          <Typography className={classes.subheading} variant="subtitle2">
            This cohort is used to determine your availability for crew assignments. Please select which cohort you are
            in for classes, A, B, remote, etc.
          </Typography>

          <Grid className={classes.controls}>
            <FormControl className={classes.selectControl} variant="outlined">
              <InputLabel>Cohort</InputLabel>
              <Select
                label="Cohort"
                value={visibleCohort}
                onChange={(e) =>
                  setModifications({
                    ...modifications,
                    cohort: e.target.value === user?.cohort ? undefined : (e.target.value as "" | "A" | "B" | "R")
                  })
                }
              >
                <MenuItem value="">
                  <em>Select One</em>
                </MenuItem>
                <MenuItem value="A">In Person: A</MenuItem>
                <MenuItem value="B">In Person: B</MenuItem>
                <MenuItem value="R">Remote</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Paper>

        <Paper className={classes.paperAuthorized}>
          <div className={classes.heading}>
            <Typography className={classes.headingText} variant="h6">
              Password
            </Typography>
          </div>
          <Typography className={classes.subheading} variant="subtitle2">
            You can change your password at any time but please remember it. If you forget your password, you will need
            to contact an admin to reset it for you. It is recommended to save your password.
          </Typography>

          {(user?.adminPassword ?? "") !== "" && (
            <Typography variant="subtitle2" color="error">
              You are still using the password chosen by the admin! Please change your password below:
            </Typography>
          )}

          <Grid className={classes.controls}>
            <TextField
              className={classes.control}
              variant="outlined"
              label="New Password"
              error={!passwordIsValid}
              value={visiblePassword}
              onChange={(e) =>
                setModifications({
                  ...modifications,
                  password: e.target.value === "" ? undefined : e.target.value,
                  adminPassword: e.target.value === "" ? undefined : ""
                })
              }
              helperText={`Between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`}
            />
            <TextField
              className={classes.control}
              variant="outlined"
              label="Confirm New Password"
              error={!confirmPasswordIsValid}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              helperText="Please retype to confirm"
            />
          </Grid>
        </Paper>

        <Button
          className={classes.clearButton}
          color="secondary"
          disabled={isEmpty(filteredModifications)}
          onClick={() => setModifications({})}
        >
          Clear Changes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={
            isUpdatingUser ? <CircularProgress className={classes.spinner} color="inherit" size={16} /> : <SaveIcon />
          }
          disabled={!canSave}
          onClick={dispatchUpdateUser}
        >
          Save Changes
        </Button>
      </Grid>
    </div>
  );
};

export default ProfilePage;
