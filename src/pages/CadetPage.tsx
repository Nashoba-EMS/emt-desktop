import React from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";

import { ReduxState } from "../redux";

const CadetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const user = useSelector((state: ReduxState) => state.users.user);
  const token = useSelector((state: ReduxState) => state.users.token);
  const cadets = useSelector((state: ReduxState) => state.users.cadets);

  const cadet = React.useMemo(() => cadets.find((cadet) => cadet._id === id) ?? null, [cadets, id]);

  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Typography paragraph>Cadet</Typography>
      <Typography paragraph>{cadet?.name}</Typography>
    </React.Fragment>
  );
};

export default CadetPage;
