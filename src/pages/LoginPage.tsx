import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) =>
  createStyles({
    loginForm: {
      padding: theme.spacing(2)
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

  return (
    <Grid container spacing={0} direction="row" alignItems="center" justify="center" style={{ minHeight: "100vh" }}>
      <Grid item xs={3}>
        <Paper className={classes.loginForm} variant="outlined">
          <TextField
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

          <Button className={classes.signInButton} variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
