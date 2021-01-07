import React from "react";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Chip from "@material-ui/core/Chip";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import FolderIcon from "@material-ui/icons/Folder";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import { ReduxState } from "./redux";
import { _users } from "./redux/actions";
import ProfilePage from "./pages/ProfilePage";
import CrewPage from "./pages/CrewPage";
import CadetPage from "./pages/CadetPage";

const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    leftAppBar: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    title: {
      marginRight: theme.spacing(1)
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerContainer: {
      overflow: "auto"
    },
    nested: {
      paddingLeft: theme.spacing(4)
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    }
  })
);

const App: React.FC = () => {
  const classes = useStyles();
  const location = useLocation();

  const user = useSelector((state: ReduxState) => state.users.user);

  const [crewsOpen, setCrewsOpen] = React.useState<boolean>(true);
  const [cadetsOpen, setCadetsOpen] = React.useState<boolean>(true);

  const dispatch = useDispatch();
  const dispatchLogout = React.useCallback(() => dispatch(_users.logout()), [dispatch]);

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <div className={classes.leftAppBar}>
            <Typography className={classes.title} variant="h6" noWrap>
              Nashoba EMS
            </Typography>
          </div>

          <Typography variant="body1" noWrap>
            {user?.name}
          </Typography>

          <IconButton onClick={dispatchLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Toolbar />

        <div className={classes.drawerContainer}>
          <ListItem button component={Link} to="/profile" selected={location.pathname === "/profile"}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
            {user?.admin && <Chip label="Admin" color="secondary" size="small" />}
          </ListItem>

          <ListItem button onClick={() => setCrewsOpen(!crewsOpen)}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Crews" />
            {crewsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={crewsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                className={classes.nested}
                button
                component={Link}
                to="/crew/test1"
                selected={location.pathname === "/crew/test1"}
              >
                <ListItemText primary="Test 1" />
              </ListItem>
              <ListItem
                className={classes.nested}
                button
                component={Link}
                to="/crew/test2"
                selected={location.pathname === "/crew/test2"}
              >
                <ListItemText primary="Test 2" />
              </ListItem>

              {user?.admin && (
                <ListItem className={classes.nested} button>
                  <ListItemIcon>
                    <AddCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="New Crew" />
                </ListItem>
              )}
            </List>
          </Collapse>

          <Divider />

          <ListItem button onClick={() => setCadetsOpen(!cadetsOpen)}>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="Cadets" />
            {cadetsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={cadetsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                className={classes.nested}
                button
                component={Link}
                to="/cadet/test1"
                selected={location.pathname === "/cadet/test1"}
              >
                <ListItemText primary="Test 1" />
              </ListItem>
              <ListItem
                className={classes.nested}
                button
                component={Link}
                to="/cadet/test2"
                selected={location.pathname === "/cadet/test2"}
              >
                <ListItemText primary="Test 2" />
              </ListItem>

              <ListItem className={classes.nested} button>
                <ListItemIcon>
                  <AddCircleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary="New Cadet" />
              </ListItem>
            </List>
          </Collapse>
        </div>
      </Drawer>

      <main className={classes.content}>
        <Toolbar />
        <Switch>
          <Redirect exact from="/" to="/profile" />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/crew/:id" component={CrewPage} />
          <Route path="/cadet/:id" component={CadetPage} />
        </Switch>
      </main>
    </div>
  );
};

export default App;
