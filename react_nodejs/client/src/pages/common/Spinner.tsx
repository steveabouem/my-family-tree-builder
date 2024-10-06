import { Box } from "@mui/material";
import React from "react";
import { BounceLoader } from "react-spinners";
import theme from "utils/material";

const Spinner = ({loading}: {loading: boolean}): JSX.Element => {
  return (
    <Box>
      <BounceLoader
        color={theme.palette.grey[400]}
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </Box>
  )
};

export default Spinner;