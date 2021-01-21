import React from "react";
import { Route, Switch, withRouter, useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import { ReduxState } from "./redux";
import { _users } from "./redux/actions";

const EntryPoint: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const loadedUser = useSelector((state: ReduxState) => state.users.loadedUser);
  const authenticated = useSelector((state: ReduxState) => state.users.authenticated);

  const dispatch = useDispatch();
  const dispatchLoadUser = React.useCallback(() => dispatch(_users.loadSession()), [dispatch]);

  /**
   * Automatically redirect based on authentication
   */
  React.useEffect(() => {
    if (!loadedUser) {
      dispatchLoadUser();
    } else {
      if (!authenticated) {
        history.push("/login");
      } else if (location.pathname === "/login") {
        history.push("/");
      }
    }
  }, [authenticated, dispatchLoadUser, history, loadedUser, location.pathname]);

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={App} />
    </Switch>
  );
};

export default withRouter(EntryPoint);
