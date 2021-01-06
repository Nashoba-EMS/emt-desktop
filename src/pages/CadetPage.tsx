import React from "react";
import { useParams } from "react-router";
import Typography from "@material-ui/core/Typography";

const CadetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <React.Fragment>
      <Typography paragraph>Cadet</Typography>
      <Typography paragraph>{id}</Typography>
    </React.Fragment>
  );
};

export default CadetPage;
