import React from "react";
import { Route, Switch, withRouter, useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
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
    } else {
      if (authenticated) {
        history.push("/app");
      } else {
        history.push("/login");
      }
    }
  }, [authenticated, dispatchLoadUser, history, loadedUser]);

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/app" component={App} />
    </Switch>
  );
};

export default withRouter(EntryPoint);
