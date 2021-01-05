import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect, withRouter, useHistory } from "react-router";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import { ReduxState } from "./redux";
import { _auth } from "./redux/actions";

const EntryPoint: React.FC = () => {
  const history = useHistory();
  const loadedUser = useSelector((state: ReduxState) => state.auth.loadedUser);
  const authenticated = useSelector((state: ReduxState) => state.auth.authenticated);

  const dispatch = useDispatch();
  const dispatchLoadUser = React.useCallback(() => dispatch(_auth.loadSession()), [dispatch]);

  React.useEffect(() => {
    if (!loadedUser) {
      dispatchLoadUser();
    }
  }, [dispatchLoadUser, loadedUser]);

  React.useEffect(() => {
    if (authenticated) {
      history.push("/app");
    } else {
      history.push("/login");
    }
  }, [authenticated, history]);

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/app" component={App} />
      <Route path="/" exact render={() => <Redirect to="/login" />} />
    </Switch>
  );
};

export default withRouter(EntryPoint);
