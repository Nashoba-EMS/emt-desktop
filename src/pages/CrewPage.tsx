import React from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
    drawerContainer: {},
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
      width: 320,
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "column"
    },
    crewMember: {},
    crewPaperTransparent: {
      width: 320,
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
      cadetIds: []
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
      <DragDropContext
        onDragEnd={(e) => {
          console.log(e);
          if (!e.destination) {
            // Remove
            if (e.source.droppableId !== "CADETS") {
              const crewIndex = crews.findIndex((crew) => crew.name === e.source.droppableId);

              if (crewIndex === -1) return;

              const crew = crews[crewIndex];

              const newCadets = Array.from(crew.cadetIds);
              newCadets.splice(e.source.index, 1);

              const newCrews = [...crews];
              newCrews[crewIndex] = {
                ...newCrews[crewIndex],
                cadetIds: newCadets
              };

              setCrews(newCrews);
            }
            return;
          }

          switch (e.source.droppableId) {
            case "CADETS": {
              // Copy
              const destinationId = e.destination.droppableId;
              const sourceItem = cadets.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))[
                e.source.index
              ];

              const crewIndex = crews.findIndex((crew) => crew.name === destinationId);

              if (crewIndex === -1) return;

              const crew = crews[crewIndex];

              if (crew.cadetIds.includes(sourceItem._id)) return;

              const newCadets = Array.from(crew.cadetIds);
              newCadets.splice(e.destination.index, 0, sourceItem._id);

              const newCrews = [...crews];
              newCrews[crewIndex] = {
                ...newCrews[crewIndex],
                cadetIds: newCadets
              };

              setCrews(newCrews);
              break;
            }
            case e.destination.droppableId: {
              // Reorder
              const destination = e.destination.droppableId;

              const crewIndex = crews.findIndex((crew) => crew.name === destination);

              if (crewIndex === -1) return;

              const crew = crews[crewIndex];

              const newCadets = Array.from(crew.cadetIds);
              const [removed] = newCadets.splice(e.source.index, 1);
              newCadets.splice(e.destination.index, 0, removed);

              const newCrews = [...crews];
              newCrews[crewIndex] = {
                ...newCrews[crewIndex],
                cadetIds: newCadets
              };

              setCrews(newCrews);
              break;
            }
            default: {
              // Move
              const sourceId = e.source.droppableId;
              const destinationId = e.destination.droppableId;

              const sourceCrewIndex = crews.findIndex((crew) => crew.name === sourceId);
              const destinationCrewIndex = crews.findIndex((crew) => crew.name === destinationId);

              if (sourceCrewIndex === -1 || destinationCrewIndex === -1) return;

              const sourceCrew = crews[sourceCrewIndex];
              const destinationCrew = crews[destinationCrewIndex];

              const newSourceCadets = Array.from(sourceCrew.cadetIds);
              const newDestinationCadets = Array.from(destinationCrew.cadetIds);

              const [removed] = newSourceCadets.splice(e.source.index, 1);
              newDestinationCadets.splice(e.destination.index, 0, removed);

              const newCrews = [...crews];
              newCrews[sourceCrewIndex] = {
                ...sourceCrew,
                cadetIds: newSourceCadets
              };
              newCrews[destinationCrewIndex] = {
                ...destinationCrew,
                cadetIds: newDestinationCadets
              };

              setCrews(newCrews);
              break;
            }
          }
        }}
      >
        <div className={classes.content}>
          {crewsWithCadets.map((crew) => (
            <Paper key={crew.name} className={classes.crewPaper}>
              <Typography variant="h6">{crew.name}</Typography>

              <Paper variant="outlined" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Droppable key={crew.name} droppableId={crew.name}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={{
                        flexGrow: 1,
                        backgroundColor: snapshot.isDraggingOver ? "#F5F5F5" : "transparent"
                      }}
                    >
                      {crew.cadets.length > 0
                        ? crew.cadets.map((cadet, index) => (
                            <Draggable
                              key={`${crew.name}-${cadet._id}`}
                              draggableId={`${crew.name}-${cadet._id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <ListItem button divider>
                                    <ListItemText primary={cadet.name} />
                                  </ListItem>
                                </div>
                              )}
                            </Draggable>
                          ))
                        : !snapshot.isDraggingOver && (
                            <div style={{ flexGrow: 1 }}>
                              <ListItem button disabled>
                                <ListItemText primary="Drop a cadet here" />
                              </ListItem>
                            </div>
                          )}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Paper>
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
              <Droppable droppableId="CADETS" isDropDisabled={true}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef}>
                    {cadets
                      .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
                      .map((cadet, index) => (
                        <Draggable key={cadet._id} draggableId={cadet._id} index={index}>
                          {(provided, snapshot) => (
                            <React.Fragment>
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <ListItem button>
                                  <ListItemText primary={cadet.name} />
                                </ListItem>
                              </div>

                              {snapshot.isDragging && (
                                <ListItem button>
                                  <ListItemText primary={cadet.name} />
                                </ListItem>
                              )}
                            </React.Fragment>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
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
      </DragDropContext>
    </div>
  );
};

export default CrewPage;
