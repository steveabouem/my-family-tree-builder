import React from "react";
import { DFamilyTree } from "../tree/definitions";
import { Grid2, Typography } from "@mui/material";
import { Card, Paper } from "material-ui";

const FamilyCard = (props: Partial<DFamilyTree>): JSX.Element => {
  return (
    <Card>
      <Paper>
      <Grid2 container>
        <Grid2 size={6}>
          <Typography variant="h3">{props.name} Family Tree</Typography>
        </Grid2>
      </Grid2>
      {}
      </Paper>
    </Card>
  );
};

export default FamilyCard;
