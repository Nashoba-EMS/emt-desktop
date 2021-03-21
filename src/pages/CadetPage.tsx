import React from "react";
import moment from "moment";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
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
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

import { ReduxState } from "../redux";
import { User } from "../api/users.d";
import { filterUndefined } from "../utils/filter";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../constants/users";
import { _users } from "../redux/actions";
import { isEmpty } from "../utils/empty";
import { getAge } from "../utils/datetime";
import { generateRandomAlphanumeric } from "../utils/password";

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
      alignItems: "flex-start"
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
    saveButton: {
      marginRight: theme.spacing(2)
    },
    savedPasswordContainer: {
      marginTop: theme.spacing(1)
    },
    savedPassword: {
      marginLeft: theme.spacing(1),
      fontWeight: "bold"
    },
    spinner: {
      marginLeft: 2,
      marginRight: 2
    },
    keyValuePair: {
      marginRight: theme.spacing(2),
      display: "flex",
      flexDirection: "column"
    },
    label: {
      fontSize: 12,
      fontsize: "8pt",
      fontWeight: "bold",
      textTransform: "uppercase",
      color: theme.palette.grey[600]
    },
    value: {}
  })
);

const CadetPage: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);
  const cadets = useSelector((state: ReduxState) => state.users.cadets);
  const isUpdatingUser = useSelector((state: ReduxState) => state.users.isUpdatingUser);
  const latestCadet = useSelector((state: ReduxState) => state.users.latestCadet);

  const [modifications, setModifications] = React.useState<Partial<User>>({});
  const [showDeleteDialog, setShowDeleteDialog] = React.useState<boolean>(false);
  const [randomPassword, setRandomPassword] = React.useState<string>("");

  const filteredModifications = React.useMemo(() => filterUndefined(modifications), [modifications]);

  const cadet = React.useMemo(() => cadets.find((cadet) => cadet._id === id) ?? null, [cadets, id]);

  const visibleName = React.useMemo(() => modifications.name ?? cadet?.name ?? "", [cadet?.name, modifications.name]);
  const visibleEmail = React.useMemo(() => modifications.email ?? cadet?.email ?? "", [
    cadet?.email,
    modifications.email
  ]);
  const visibleBirthdate = React.useMemo(() => modifications.birthdate ?? cadet?.birthdate ?? "", [
    cadet?.birthdate,
    modifications.birthdate
  ]);
  const visibleGender = React.useMemo(() => modifications.gender ?? cadet?.gender ?? "", [
    cadet?.gender,
    modifications.gender
  ]);
  const visibleEligible = React.useMemo(() => modifications.eligible ?? cadet?.eligible ?? false, [
    cadet?.eligible,
    modifications.eligible
  ]);
  const visibleCertified = React.useMemo(() => modifications.certified ?? cadet?.certified ?? false, [
    cadet?.certified,
    modifications.certified
  ]);
  const visibleChief = React.useMemo(() => modifications.chief ?? cadet?.chief ?? false, [
    cadet?.chief,
    modifications.chief
  ]);
  const visibleAdmin = React.useMemo(() => modifications.admin ?? cadet?.admin ?? false, [
    cadet?.admin,
    modifications.admin
  ]);
  const visibleCohort = React.useMemo(() => modifications.cohort ?? cadet?.cohort ?? "", [
    cadet?.cohort,
    modifications.cohort
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

  const canSave = React.useMemo(
    () => !isEmpty(filteredModifications) && nameIsValid && emailIsValid && birthdateIsValid && passwordIsValid,
    [birthdateIsValid, emailIsValid, filteredModifications, nameIsValid, passwordIsValid]
  );

  const birthdateAsMoment = React.useMemo(() => (visibleBirthdate !== "" ? moment(visibleBirthdate) : null), [
    visibleBirthdate
  ]);

  const age = React.useMemo(() => (birthdateIsValid ? getAge(visibleBirthdate) : 0), [
    birthdateIsValid,
    visibleBirthdate
  ]);

  const dispatch = useDispatch();
  const dispatchUpdateUser = React.useCallback(
    () => dispatch(_users.updateUser(token, cadet?.email ?? "", modifications)),
    [cadet?.email, dispatch, modifications, token]
  );
  const dispatchDeleteUser = React.useCallback(() => dispatch(_users.deleteUser(token, cadet?.email ?? "")), [
    cadet?.email,
    dispatch,
    token
  ]);

  /**
   * Clear changes on save
   */
  React.useEffect(() => {
    if (latestCadet?._id === cadet?._id) {
      setModifications({});
    }
  }, [cadet?._id, latestCadet]);

  /**
   * Clear changes when switching cadet
   */
  React.useEffect(() => {
    setModifications({});
    setShowDeleteDialog(false);
    setRandomPassword("");
  }, [cadet?._id]);

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
            {user?.admin === true ? (
              <TextField
                className={classes.control}
                variant="outlined"
                label="Name"
                error={!nameIsValid}
                value={visibleName}
                onChange={(e) =>
                  setModifications((prevModifications) => ({
                    ...prevModifications,
                    name: e.target.value === cadet?.name ? undefined : e.target.value
                  }))
                }
              />
            ) : (
              <div className={classes.keyValuePair}>
                <Typography className={classes.label}>Name</Typography>
                <Typography className={classes.value}>{visibleName}</Typography>
              </div>
            )}
            {user?.admin === true ? (
              <TextField
                className={classes.control}
                variant="outlined"
                label="Email"
                error={!emailIsValid}
                value={visibleEmail}
                onChange={(e) =>
                  setModifications((prevModifications) => ({
                    ...prevModifications,
                    email: e.target.value.toLowerCase() === cadet?.email ? undefined : e.target.value.toLowerCase()
                  }))
                }
              />
            ) : (
              <div className={classes.keyValuePair}>
                <Typography className={classes.label}>Email</Typography>
                <Typography className={classes.value}>{visibleEmail}</Typography>
              </div>
            )}
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
            {user?.admin ? (
              <KeyboardDatePicker
                className={classes.control}
                disableToolbar
                variant="inline"
                inputVariant="outlined"
                format="MM/DD/YYYY"
                id="cadet-birthdate-picker"
                label="Birth Date"
                helperText="Format: MM/DD/YYYY"
                error={!birthdateIsValid}
                value={birthdateAsMoment}
                onChange={(date) => {
                  const newBirthdate = date?.isValid() ? date.format("YYYY-MM-DD") : "";

                  setModifications((prevModifications) => ({
                    ...prevModifications,
                    birthdate: newBirthdate === cadet?.birthdate ? undefined : newBirthdate
                  }));
                }}
              />
            ) : (
              <div className={classes.keyValuePair}>
                <Typography className={classes.label}>Birthdate</Typography>
                <Typography className={classes.value}>{visibleBirthdate}</Typography>
              </div>
            )}
            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel control={<Checkbox checked={age >= 18} disabled />} label="Over 18" />
              <FormHelperText>Based on birthdate</FormHelperText>
            </FormGroup>
            {user?.admin && (
              <FormControl className={classes.control} variant="outlined">
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Cohort"
                  value={visibleGender}
                  onChange={(e) =>
                    setModifications((prevModifications) => ({
                      ...prevModifications,
                      gender: e.target.value === cadet?.gender ? undefined : (e.target.value as User["gender"])
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
            )}
            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleEligible}
                    disabled={!user?.admin}
                    onChange={(e) =>
                      setModifications((prevModifications) => ({
                        ...prevModifications,
                        eligible: e.target.checked === cadet?.eligible ? undefined : e.target.checked
                      }))
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
                      setModifications((prevModifications) => ({
                        ...prevModifications,
                        certified: e.target.checked === cadet?.certified ? undefined : e.target.checked
                      }))
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
                      setModifications((prevModifications) => ({
                        ...prevModifications,
                        chief: e.target.checked === cadet?.chief ? undefined : e.target.checked
                      }))
                    }
                  />
                }
                label="Chief"
              />
              <FormHelperText>Crew chief</FormHelperText>
            </FormGroup>
            <FormGroup className={classes.checkboxContainer}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleAdmin}
                    disabled={!user?.admin}
                    onChange={(e) =>
                      setModifications((prevModifications) => ({
                        ...prevModifications,
                        admin: e.target.checked === cadet?.admin ? undefined : e.target.checked
                      }))
                    }
                  />
                }
                label="Admin"
              />
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
            {user?.admin === true ? (
              <FormControl className={classes.selectControl} variant="outlined">
                <InputLabel>Cohort</InputLabel>
                <Select
                  label="Cohort"
                  value={visibleCohort}
                  onChange={(e) =>
                    setModifications((prevModifications) => ({
                      ...prevModifications,
                      cohort: e.target.value === cadet?.cohort ? undefined : (e.target.value as User["cohort"])
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
              </FormControl>
            ) : (
              <div className={classes.keyValuePair}>
                <Typography className={classes.label}>Cohort</Typography>
                <Typography className={classes.value}>
                  {visibleCohort === "A"
                    ? "In Person: A"
                    : visibleCohort === "B"
                    ? "In Person: B"
                    : visibleCohort === "R"
                    ? "Remote"
                    : "Not Provided"}
                </Typography>
              </div>
            )}
          </Grid>
        </Paper>

        {user?.admin === true && (
          <React.Fragment>
            <Paper className={classes.paperAuthorized}>
              <div className={classes.heading}>
                <Typography className={classes.headingText} variant="h6">
                  Password
                </Typography>
              </div>
              <Typography className={classes.subheading} variant="subtitle2">
                You can change your password at any time but please remember it. If you forget your password, you will
                need to contact an admin to reset it for you. It is recommended to save your password.
              </Typography>

              {(cadet?.adminPassword ?? "") !== "" && (
                <Grid className={classes.savedPasswordContainer} container alignItems="center">
                  <Typography>User has not changed their password from the password chosen by an admin:</Typography>
                  <Typography className={classes.savedPassword} color="secondary">
                    {cadet?.adminPassword}
                  </Typography>
                </Grid>
              )}

              <Grid className={classes.controls}>
                <TextField
                  className={classes.control}
                  variant="outlined"
                  label="New Password"
                  error={!passwordIsValid}
                  value={visiblePassword}
                  onChange={(e) => {
                    setRandomPassword("");
                    setModifications((prevModifications) => ({
                      ...prevModifications,
                      password: e.target.value === "" ? undefined : e.target.value,
                      // Update the admin password
                      adminPassword: e.target.value === "" ? undefined : e.target.value
                    }));
                  }}
                  helperText={`Between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`}
                />

                <Grid>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      const password = generateRandomAlphanumeric(); // lgtm [js/insecure-randomness]

                      setRandomPassword(password);
                      setModifications((prevModifications) => ({
                        ...prevModifications,
                        password,
                        adminPassword: password
                      }));
                    }}
                  >
                    Suggest Random
                  </Button>

                  {randomPassword !== "" && (
                    <Grid className={classes.savedPasswordContainer} container alignItems="center">
                      <Typography>Remember to save:</Typography>
                      <Typography className={classes.savedPassword} color="secondary">
                        {randomPassword}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Paper>

            <Button
              className={classes.clearButton}
              color="secondary"
              disabled={isEmpty(filteredModifications) || isUpdatingUser}
              onClick={() => {
                setRandomPassword("");
                setModifications({});
              }}
            >
              Clear Changes
            </Button>
            <Button
              className={classes.saveButton}
              variant="contained"
              color="secondary"
              startIcon={
                isUpdatingUser ? (
                  <CircularProgress className={classes.spinner} color="inherit" size={16} />
                ) : (
                  <SaveIcon />
                )
              }
              disabled={!canSave || isUpdatingUser}
              onClick={dispatchUpdateUser}
            >
              Save Changes
            </Button>
            <IconButton disabled={isUpdatingUser} onClick={() => setShowDeleteDialog(true)}>
              <DeleteIcon />
            </IconButton>

            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
              <DialogTitle>Delete {cadet?.name}?</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Once deleted, you can create a new user with this email, but will have to start from scratch. Are you
                  sure you want to continue?
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                <Button color="secondary" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    dispatchDeleteUser();
                    history.push("/profile");
                  }}
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        )}
      </Grid>
    </div>
  );
};

export default CadetPage;
