import React from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import AddIcon from "@material-ui/icons/Add";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";

import { ReduxState } from "../redux";
import { _crews } from "../redux/actions";
import { Crew } from "../api/crews.d";
import { UserWithoutPassword } from "../api/users.d";

const drawerWidth = 256;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    crewContainer: {
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
    boldyPrimaryCadetText: {
      fontWeight: "bold"
    },
    content: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-evenly"
    },
    crewPaper: {
      width: 320,
      margin: theme.spacing(1),
      padding: theme.spacing(2),
      display: "flex",
      flexDirection: "column"
    },
    crewHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    innerCrewPaper: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column"
    },
    crewMember: {},
    crewPaperTransparent: {
      width: 320,
      minHeight: 214,
      padding: theme.spacing(2),
      margin: theme.spacing(1),
      borderRadius: 6,
      borderStyle: "dashed",
      borderWidth: 2,
      borderColor: theme.palette.grey[400],
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: theme.palette.grey[600]
    },
    clearButton: {
      marginRight: theme.spacing(1)
    },
    saveButton: {
      marginRight: theme.spacing(2)
    },
    spinner: {
      marginLeft: 2,
      marginRight: 2
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
  const history = useHistory();

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);
  const cadets = useSelector((state: ReduxState) => state.users.cadets);
  const crewAssignments = useSelector((state: ReduxState) => state.crews.crewAssignments);
  const isUpdatingCrew = useSelector((state: ReduxState) => state.crews.isUpdatingCrew);

  const [showNewDialog, setShowNewDialog] = React.useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState<boolean>(false);
  const [newCrewName, setNewCrewName] = React.useState<string>("");
  const [tabIndex, setTabIndex] = React.useState<number>(0);
  const [crews, setCrews] = React.useState<Crew[]>([]);

  /**
   * The current viewed crew assignment
   */
  const crewAssignment = React.useMemo(() => crewAssignments.find((crew) => crew._id === id) ?? null, [
    crewAssignments,
    id
  ]);

  const isModified = React.useMemo(() => JSON.stringify(crews) !== JSON.stringify(crewAssignment?.crews ?? []), [
    crewAssignment?.crews,
    crews
  ]);

  /**
   * Add the cadets to each crew
   */
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

  /**
   * Add the crews to each cadet
   */
  const cadetsWithCrews = React.useMemo(
    () =>
      cadets.map((cadet) => ({
        ...cadet,
        crews: crews.filter((crew) => crew.cadetIds.includes(cadet._id)).map((crew) => crew.name)
      })),
    [cadets, crews]
  );

  /**
   * The name of the new crew is nonzero and unique
   */
  const newCrewNameIsValid = React.useMemo(
    () =>
      newCrewName.trim().length > 0 &&
      crews.findIndex((crew) => crew.name.toLowerCase() === newCrewName.toLowerCase()) === -1,
    [crews, newCrewName]
  );

  /**
   * Cadets who can be added to crews
   */
  const eligibleCadets = cadetsWithCrews
    .filter((cadet) => cadet.eligible)
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

  const dispatch = useDispatch();
  const dispatchUpdateCrew = React.useCallback(
    () =>
      dispatch(
        _crews.updateCrew(token, crewAssignment?._id ?? "", {
          name: crewAssignment?.name ?? "",
          crews
        })
      ),
    [crewAssignment?._id, crewAssignment?.name, crews, dispatch, token]
  );
  const dispatchDeleteCrew = React.useCallback(() => dispatch(_crews.deleteCrew(token, crewAssignment?._id ?? "")), [
    crewAssignment?._id,
    dispatch,
    token
  ]);

  /**
   * Remove a cadet from a crew with the given name
   */
  const removeFromCrew = (crewName: string, cadet: UserWithoutPassword) => {
    const sourceCrewIndex = crews.findIndex((crew) => crew.name === crewName);

    // No crew
    if (sourceCrewIndex === -1) return;

    const sourceCrew = crews[sourceCrewIndex];
    const sourceIndex = sourceCrew.cadetIds.findIndex((cadetId) => cadetId === cadet._id);

    // No cadet
    if (sourceIndex === -1) return;

    const newSourceCadets = Array.from(sourceCrew.cadetIds);
    newSourceCadets.splice(sourceIndex, 1);

    const newCrews = [...crews];

    newCrews[sourceCrewIndex] = {
      ...sourceCrew,
      cadetIds: newSourceCadets
    };

    setCrews(newCrews);
  };

  /**
   * Handle a cadet drag and drop event
   */
  const handleDrop = (e: DropResult) => {
    const sourceId = e.source.droppableId;
    const destinationId = e.destination?.droppableId;

    const sourceCrewIndex = crews.findIndex((crew) => crew.name === sourceId);
    const destinationCrewIndex = crews.findIndex((crew) => crew.name === destinationId);

    const sourceCrew = sourceId !== "CADETS" ? crews[sourceCrewIndex] : null;
    const destinationCrew = e.destination ? crews[destinationCrewIndex] : null;

    const newSourceCadets = Array.from(sourceCrew?.cadetIds ?? []);
    const newDestinationCadets = Array.from(destinationCrew?.cadetIds ?? []);

    if (!e.destination) {
      // Remove
      if (e.source.droppableId !== "CADETS") {
        newSourceCadets.splice(e.source.index, 1);
      }
    } else {
      switch (sourceId) {
        case "CADETS": {
          // Copy
          const sourceItem = eligibleCadets[e.source.index];

          // Prevent duplicates
          if (newDestinationCadets.includes(sourceItem._id)) return;

          newDestinationCadets.splice(e.destination.index, 0, sourceItem._id);
          break;
        }
        case e.destination.droppableId: {
          // Reorder
          const [removed] = newDestinationCadets.splice(e.source.index, 1);
          newDestinationCadets.splice(e.destination.index, 0, removed);
          break;
        }
        default: {
          // Move
          // Prevent duplicates
          if (newDestinationCadets.includes(newSourceCadets[e.source.index])) return;

          const [removed] = newSourceCadets.splice(e.source.index, 1);
          newDestinationCadets.splice(e.destination.index, 0, removed);
          break;
        }
      }
    }

    const newCrews = [...crews];

    // Update source crew
    if (sourceCrew) {
      newCrews[sourceCrewIndex] = {
        ...sourceCrew,
        cadetIds: newSourceCadets
      };
    }

    // Update destination crew
    if (destinationCrew) {
      newCrews[destinationCrewIndex] = {
        ...destinationCrew,
        cadetIds: newDestinationCadets
      };
    }

    setCrews(newCrews);
  };

  /**
   * Update the crew state with the current crew
   */
  React.useEffect(() => {
    if (crewAssignment) {
      setCrews(crewAssignment.crews);
    }
  }, [crewAssignment]);

  const renderCadet = (cadet: UserWithoutPassword, source: string, divider = false, numberOfCrews = -1) => (
    <ListItem button divider={divider} onDoubleClick={() => user?.admin && source && removeFromCrew(source, cadet)}>
      <ListItemText
        classes={{ primary: numberOfCrews === 0 ? classes.boldyPrimaryCadetText : undefined }}
        primary={cadet.name}
        secondary={
          numberOfCrews === 0
            ? "Not assigned to a crew"
            : numberOfCrews > 0
            ? `Assigned to ${numberOfCrews} crews`
            : user?.admin
            ? "Double click to remove"
            : ""
        }
      />

      {cadet.chief && (
        <Tooltip title="Cadet is a chief">
          <PersonIcon color="secondary" />
        </Tooltip>
      )}
      {cadet.certified && (
        <Tooltip title="Cadet is certified">
          <VerifiedUserIcon color="secondary" />
        </Tooltip>
      )}
    </ListItem>
  );

  if (!user?.admin) {
    return (
      <div className={classes.root}>
        <div className={classes.crewContainer}>
          <div className={classes.content}>
            {crewsWithCadets.map((crew) => (
              <Paper key={crew.name} className={classes.crewPaper}>
                <div className={classes.crewHeader}>
                  <Typography variant="h6">{crew.name}</Typography>
                </div>

                <Paper className={classes.innerCrewPaper} variant="outlined">
                  {crew.cadets.map((cadet) => renderCadet(cadet, crew.name, true))}
                </Paper>
              </Paper>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.crewContainer}>
        <DragDropContext onDragEnd={handleDrop}>
          <div className={classes.content}>
            {crewsWithCadets.map((crew) => (
              <Paper key={crew.name} className={classes.crewPaper}>
                <div className={classes.crewHeader}>
                  <Typography variant="h6">{crew.name}</Typography>

                  <IconButton
                    disabled={isUpdatingCrew}
                    onClick={() => setCrews(crews.filter((thisCrew) => thisCrew.name !== crew.name))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>

                <Paper className={classes.innerCrewPaper} variant="outlined">
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
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {renderCadet(cadet, crew.name, true)}
                                  </div>
                                )}
                              </Draggable>
                            ))
                          : !snapshot.isUsingPlaceholder && (
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

                <Tooltip title="Every crew needs to have a crew chief">
                  <FormControlLabel
                    control={<Checkbox checked={crew.cadets.findIndex((cadet) => cadet.chief) >= 0} />}
                    label="Has a crew chief"
                  />
                </Tooltip>
                <Tooltip title="Every crew needs to have a certified cadet">
                  <FormControlLabel
                    control={<Checkbox checked={crew.cadets.findIndex((cadet) => cadet.certified) >= 0} />}
                    label="Has a certified cadet"
                  />
                </Tooltip>
              </Paper>
            ))}

            <CardActionArea
              className={classes.crewPaperTransparent}
              onClick={() => {
                setShowNewDialog(true);
                setNewCrewName("");
              }}
            >
              <AddIcon />
              <Typography>New Crew</Typography>
            </CardActionArea>
          </div>

          <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="right"
            classes={{ paper: classes.drawerPaper }}
          >
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
                  <Tab label="A" style={{ minWidth: "auto" }} disabled />
                  <Tab label="B" style={{ minWidth: "auto" }} disabled />
                </Tabs>

                <Divider />
              </div>

              <TabPanel value={tabIndex} index={0}>
                <Droppable droppableId="CADETS" isDropDisabled={true}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                      {eligibleCadets.map((cadet, index) => (
                        <Draggable key={cadet._id} draggableId={cadet._id} index={index}>
                          {(provided, snapshot) => (
                            <React.Fragment>
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Tooltip title="Drag and drop onto a crew">
                                  {renderCadet(cadet, "CADETS", false, cadet.crews.length)}
                                </Tooltip>
                              </div>

                              {snapshot.isDragging && renderCadet(cadet, "CADETS", false, cadet.crews.length)}
                            </React.Fragment>
                          )}
                        </Draggable>
                      ))}

                      <div style={{ display: "none" }}>{provided.placeholder}</div>
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

      <Grid>
        <Button
          className={classes.clearButton}
          color="secondary"
          disabled={!isModified}
          onClick={() => {
            setCrews(crewAssignment?.crews ?? []);
          }}
        >
          Clear Changes
        </Button>
        <Button
          className={classes.saveButton}
          variant="contained"
          color="secondary"
          startIcon={
            isUpdatingCrew ? <CircularProgress className={classes.spinner} color="inherit" size={16} /> : <SaveIcon />
          }
          disabled={!isModified || isUpdatingCrew}
          onClick={dispatchUpdateCrew}
        >
          Save Changes
        </Button>
        <IconButton disabled={isUpdatingCrew} onClick={() => setShowDeleteDialog(true)}>
          <DeleteIcon />
        </IconButton>
      </Grid>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete {crewAssignment?.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once deleted, you can create a new crew assignment with this name, but will have to start from scratch. Are
            you sure you want to continue?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="secondary" onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              dispatchDeleteCrew();
              history.push("/profile");
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showNewDialog} onClose={() => setShowNewDialog(false)}>
        <form>
          <DialogTitle>Add a new crew</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Each crew must pass certain requirements to be valid. A potential naming scheme could be Crew A, Crew B,
              etc.
            </DialogContentText>
            <TextField
              margin="dense"
              variant="filled"
              fullWidth
              label="Name"
              required
              helperText="Pick a unique name to identify the crew"
              autoFocus
              error={!newCrewNameIsValid}
              value={newCrewName}
              onChange={(e) => setNewCrewName(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setShowNewDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newCrewNameIsValid}
              onClick={(e) => {
                // Prevent page refresh
                e.preventDefault();

                setCrews([...crews, { name: newCrewName, cadetIds: [] }]);
                setShowNewDialog(false);
              }}
              color="secondary"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CrewPage;
