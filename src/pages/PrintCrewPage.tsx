import React from "react";
import { useSelector } from "react-redux";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import PersonIcon from "@material-ui/icons/Person";

import { ReduxState } from "../redux";
import { _crews } from "../redux/actions";
import { UserWithoutPassword } from "../api/users.d";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    crewContainer: {
      width: "100%",
      display: "flex"
    },
    content: {
      width: "100%",
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
    crewMember: {}
  })
);

const PrintCrewPage: React.FC<{ id: string }> = ({ id }) => {
  const classes = useStyles();

  const cadets = useSelector((state: ReduxState) => state.users.cadets);
  const crewAssignments = useSelector((state: ReduxState) => state.crews.crewAssignments);

  /**
   * The current viewed crew assignment
   */
  const crewAssignment = React.useMemo(() => crewAssignments.find((crew) => crew._id === id) ?? null, [
    crewAssignments,
    id
  ]);
  /**
   * Add the cadets to each crew
   */
  const crewsWithCadets = React.useMemo(
    () =>
      crewAssignment?.crews.map((crew) => ({
        ...crew,
        cadets: crew.cadetIds
          .map((cadetId) => cadets.find((cadet) => cadet._id === cadetId))
          .filter((cadet) => cadet !== undefined) as UserWithoutPassword[]
      })) ?? [],
    [cadets, crewAssignment?.crews]
  );

  const renderCadet = (cadet: UserWithoutPassword) => (
    <ListItem key={cadet._id} button divider>
      <ListItemText primary={cadet.name} />

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

  return (
    <div className={classes.root}>
      <Typography variant="h5">{crewAssignment?.name}</Typography>
      <div className={classes.crewContainer}>
        <div className={classes.content}>
          {crewsWithCadets.map((crew) => (
            <Paper key={crew.name} className={classes.crewPaper}>
              <div className={classes.crewHeader}>
                <Typography variant="h6">{crew.name}</Typography>
              </div>

              <Paper className={classes.innerCrewPaper} variant="outlined">
                {crew.cadets.map((cadet) => renderCadet(cadet))}
              </Paper>
            </Paper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintCrewPage;
