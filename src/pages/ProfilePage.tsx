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
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

import { ReduxState } from "../redux";
import { User } from "../api/users.d";
import { _users } from "../redux/actions";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../constants/users";
import { filterUndefined } from "../utils/filter";
import { isEmpty } from "../utils/empty";

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
    }
  })
);

const ProfilePage: React.FC = () => {
  const classes = useStyles();

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);

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

  const dispatch = useDispatch();
  const dispatchUpdateUser = React.useCallback(
    () => dispatch(_users.updateUser(token, user?.email ?? "", modifications)),
    [dispatch, modifications, token, user?.email]
  );

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
              value={visibleEmail}
              onChange={(e) =>
                setModifications({
                  ...modifications,
                  email: e.target.value === user?.email ? undefined : e.target.value
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
              value={visibleBirthdate}
              onChange={(e) =>
                setModifications({
                  ...modifications,
                  birthdate: e.target.value === user?.birthdate ? undefined : e.target.value
                })
              }
              helperText="Format: YYYY-MM-DD"
            />
            <FormGroup>
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
            </FormGroup>
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

          <Grid className={classes.controls}>
            <TextField
              className={classes.control}
              variant="outlined"
              label="New Password"
              value={visiblePassword}
              onChange={(e) =>
                setModifications({ ...modifications, password: e.target.value === "" ? undefined : e.target.value })
              }
              helperText={`Between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`}
            />
            <TextField
              className={classes.control}
              variant="outlined"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              helperText="Please retype to confirm"
            />
          </Grid>
        </Paper>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
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