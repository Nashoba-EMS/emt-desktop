import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PersonIcon from "@material-ui/icons/PersonOutline";
import ScheduleIcon from "@material-ui/icons/Schedule";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUserOutlined";

import { ReduxState } from "./redux";

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

  const user = useSelector((state: ReduxState) => state.auth.user);

  const [schedulesOpen, setSchedulesOpen] = React.useState<boolean>(true);
  const [usersOpen, setUsersOpen] = React.useState<boolean>(true);

  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <div className={classes.leftAppBar}>
            <Typography className={classes.title} variant="h6" noWrap>
              Nashoba EMS
            </Typography>
            <Typography variant="body1" noWrap>
              {user?.name}
            </Typography>
          </div>
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
          <ListItem button>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
            {user?.admin && <Chip label="Admin" color="secondary" size="small" />}
          </ListItem>

          <ListItem button onClick={() => setSchedulesOpen(!schedulesOpen)}>
            <ListItemIcon>
              <ScheduleIcon />
            </ListItemIcon>
            <ListItemText primary="Schedules" />
            {schedulesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={schedulesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemText primary="TODO" />
              </ListItem>

              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <AddCircleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary="New Schedule" />
              </ListItem>
            </List>
          </Collapse>

          <Divider />

          <ListItem button onClick={() => setUsersOpen(!usersOpen)}>
            <ListItemIcon>
              <VerifiedUserIcon />
            </ListItemIcon>
            <ListItemText primary="Cadets" />
            {usersOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={usersOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemText primary="TODO" />
              </ListItem>

              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <AddCircleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary="New User" />
              </ListItem>
            </List>
          </Collapse>
        </div>
      </Drawer>

      <main className={classes.content}>
        <Toolbar />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
          velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu
          scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt
          lobortis feugiat vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
          ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla facilisi etiam
          dignissim diam. Pulvinar elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus
          sed viverra tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod
          lacinia at quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in.
          In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean euismod
          elementum nisi quis eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere
          sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </main>
    </div>
  );
};

export default App;
