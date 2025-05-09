import React from "react";
import { Backdrop, useTheme } from "@mui/material";
import { BounceLoader } from "react-spinners";

const Spinner = ({loading}: {loading: boolean}): JSX.Element => {
    const seasonalTheme = useTheme();
  
  return (
    <Backdrop open={loading} sx={{zIndex: 100}}>
      <BounceLoader
        color={seasonalTheme.palette.grey[400]}
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </Backdrop>
  )
};

export default Spinner;