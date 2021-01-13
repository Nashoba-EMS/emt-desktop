import React from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { MuiThemeProvider, createMuiTheme, createStyles, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import PrintOutlinedIcon from "@material-ui/icons/PrintOutlined";

const drawerWidth = 256;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
      display: "flex"
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
    drawerControls: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    gray: {
      color: theme.palette.grey[600]
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    }
  })
);

const TabPanel: React.FC<{ children?: React.ReactNode; index: any; value: any }> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const CrewPage: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();

  const [printView, setPrintView] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  return (
    <div className={classes.root}>
      <div className={classes.content}></div>

      <Drawer className={classes.drawer} variant="permanent" anchor="right" classes={{ paper: classes.drawerPaper }}>
        <Toolbar />

        <div className={classes.drawerContainer}>
          <div className={classes.drawerControls}>
            <Typography variant="h6">Cadets</Typography>
            <Typography className={classes.gray} variant="body2">
              Drag and drop cadets onto a crew to assign them. You can choose what cohort to view below:
            </Typography>
          </div>

          <div>
            <Tabs variant="fullWidth" value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
              <Tab label="Both" style={{ minWidth: "auto" }} />
              <Tab label="A" style={{ minWidth: "auto" }} />
              <Tab label="B" style={{ minWidth: "auto" }} />
            </Tabs>

            <Divider />
          </div>

          <TabPanel value={tabIndex} index={0}>
            <ListItem button>
              <ListItemText primary="Cohort A and B" />
            </ListItem>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <ListItem button>
              <ListItemText primary="Cohort A" />
            </ListItem>
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <ListItem button>
              <ListItemText primary="Cohort B" />
            </ListItem>
          </TabPanel>
        </div>
      </Drawer>
    </div>
  );
};

export default CrewPage;
