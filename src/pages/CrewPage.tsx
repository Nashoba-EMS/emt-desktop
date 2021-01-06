import React from "react";
import { useParams } from "react-router";
import Typography from "@material-ui/core/Typography";

const CrewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <React.Fragment>
      <Typography paragraph>Crew</Typography>
      <Typography paragraph>{id}</Typography>
    </React.Fragment>
  );
};

export default CrewPage;
