import React from "react";
import { Route, Switch, withRouter, useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import { ReduxState } from "./redux";
import { _users } from "./redux/actions";

const EntryPoint: React.FC = () => {
  const history = useHistory();
  const loadedUser = useSelector((state: ReduxState) => state.users.loadedUser);
  const authenticated = useSelector((state: ReduxState) => state.users.authenticated);

  const dispatch = useDispatch();
  const dispatchLoadUser = React.useCallback(() => dispatch(_users.loadSession()), [dispatch]);

  React.useEffect(() => {
    if (!loadedUser) {
      dispatchLoadUser();
    } else {
      if (authenticated) {
        history.push("/");
      } else {
        history.push("/login");
      }
    }
  }, [authenticated, dispatchLoadUser, history, loadedUser]);

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={App} />
    </Switch>
  );
};

export default withRouter(EntryPoint);
