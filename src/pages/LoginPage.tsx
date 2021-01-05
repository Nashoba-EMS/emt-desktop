import React from "react";
import { useDispatch } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { _auth } from "../redux/actions";

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
    }
  })
);

const LoginPage: React.FC = () => {
  const classes = useStyles();

  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const dispatch = useDispatch();
  const dispatchLogin = React.useCallback(() => dispatch(_auth.login(email, password)), [dispatch, email, password]);

  const onClickSignIn = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      dispatchLogin();
    },
    [dispatchLogin]
  );

  return (
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

            <Button
              className={classes.signInButton}
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              onClick={onClickSignIn}
            >
              Sign In
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
