import React, { Component } from "react";
import { useSelector } from "react-redux";
import { Route, Switch, Redirect, withRouter, useHistory } from "react-router";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import { ReduxState } from "./redux";

const EntryPoint: React.FC = () => {
  const history = useHistory();
  const authenticated = useSelector((state: ReduxState) => state.auth.authenticated);

  React.useEffect(() => {
    if (!authenticated) {
      history.push("/login");
    } else {
      history.push("/app");
    }
  }, [authenticated, history]);

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/app" component={App} />
      <Route path="/" exact render={() => <Redirect to="/app" />} />
    </Switch>
  );
};

export default withRouter(EntryPoint);
