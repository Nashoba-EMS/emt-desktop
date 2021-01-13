import React from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CardActionArea from "@material-ui/core/CardActionArea";
import AddIcon from "@material-ui/icons/Add";

import { ReduxState } from "../redux";
import { Crew } from "../api/crews.d";
import { UserWithoutPassword } from "../api/users.d";

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
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap"
    },
    crewPaper: {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: 240,
      padding: theme.spacing(2)
    },
    crewMember: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },
    crewPaperTransparent: {
      width: 240,
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      borderRadius: 6,
      borderStyle: "dashed",
      borderWidth: 2,
      borderColor: theme.palette.grey[400],
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: theme.palette.grey[600]
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
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const CrewPage: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);
  const cadets = useSelector((state: ReduxState) => state.users.cadets);

  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const [crews, setCrews] = React.useState<Crew[]>([
    {
      name: "Crew A",
      cadetIds: ["5ff3807528062396204b5c75", "5ffa33aea5c45460c1e75965"]
    },
    {
      name: "Crew B",
      cadetIds: ["5ff3807528062396204b5c75"]
    },
    {
      name: "Crew C",
      cadetIds: ["5ff3807528062396204b5c75", "5ffa33aea5c45460c1e75965"]
    }
  ]);

  const crewsWithCadets = React.useMemo(
    () =>
      crews.map((crew) => ({
        ...crew,
        cadets: crew.cadetIds
          .map((cadetId) => cadets.find((cadet) => cadet._id === cadetId))
          .filter((cadet) => cadet !== undefined) as UserWithoutPassword[]
      })),
    [cadets, crews]
  );

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {crewsWithCadets.map((crew) => (
          <Paper key={crew.name} className={classes.crewPaper}>
            <Typography variant="h6">{crew.name}</Typography>

            {crew.cadets.map((cadet, index) => (
              <React.Fragment key={cadet._id}>
                <div className={classes.crewMember}>
                  <Typography>{cadet.name}</Typography>
                </div>

                <Divider />
              </React.Fragment>
            ))}
          </Paper>
        ))}

        <CardActionArea className={classes.crewPaperTransparent} onClick={() => console.log("TODO")}>
          <AddIcon />
          <Typography>New Crew</Typography>
        </CardActionArea>
      </div>

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
