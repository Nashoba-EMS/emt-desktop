import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import { ReduxState } from "../redux";
import { _auth } from "../redux/actions";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "../constants/users";

const useStyles = makeStyles((theme) =>
  createStyles({
    loginForm: {
      padding: theme.spacing(2)
    },
    subtitle: {
      color: theme.palette.grey["500"]
    },
    innerFormField: {
      marginTop: theme.spacing(2)
    },
    signInButton: {
      marginTop: theme.spacing(2)
    },
    errorMessage: {
      background: theme.palette.error.main,
      color: theme.palette.error.contrastText
    }
  })
);

const LoginPage: React.FC = () => {
  const classes = useStyles();

  const isAuthenticating = useSelector((state: ReduxState) => state.auth.isAuthenticating);
  const authenticationErrorMessage = useSelector((state: ReduxState) => state.auth.authenticationErrorMessage);

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const emailIsValid = React.useMemo(() => email.includes("@") && email.includes(".") && email.length >= 5, [email]);
  const passwordIsValid = React.useMemo(
    () => password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH,
    [password]
  );

  const dispatch = useDispatch();
  const dispatchLogin = React.useCallback(() => dispatch(_auth.login(email, password)), [dispatch, email, password]);
  const dispatchLoginReset = React.useCallback(() => dispatch(_auth.loginReset()), [dispatch]);

  const onClickSignIn = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      dispatchLogin();
    },
    [dispatchLogin]
  );

  return (
    <React.Fragment>
      <Grid container spacing={0} direction="row" alignItems="center" justify="center" style={{ minHeight: "100vh" }}>
        <Grid item xs={3}>
          <Paper className={classes.loginForm} variant="outlined">
            <form>
              <Typography variant="h6">Nashoba EMS Scheduler</Typography>
              <Typography className={classes.subtitle} variant="body2">
                If this is your first time signing in, please use the email and password provided to you by the schedule
                admin. You can change your password once you have signed in.
              </Typography>

              <TextField
                className={classes.innerFormField}
                variant="outlined"
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                className={classes.innerFormField}
                variant="outlined"
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Tooltip
                title={
                  !emailIsValid
                    ? "Email is invalid"
                    : !passwordIsValid
                    ? `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`
                    : ""
                }
              >
                <div>
                  <Button
                    className={classes.signInButton}
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={isAuthenticating || !emailIsValid || !passwordIsValid}
                    onClick={onClickSignIn}
                  >
                    Sign In
                  </Button>
                </div>
              </Tooltip>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        open={authenticationErrorMessage !== ""}
        autoHideDuration={4000}
        onClose={dispatchLoginReset}
      >
        <SnackbarContent className={classes.errorMessage} message={authenticationErrorMessage} />
      </Snackbar>
    </React.Fragment>
  );
};

export default LoginPage;
