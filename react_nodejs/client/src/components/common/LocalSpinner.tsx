import { Box } from "@mui/material";
import React from "react";
import { BounceLoader } from "react-spinners";
import theme from "utils/material";

const LocalSpinner = ({ loading, height = 90, width = 90 }: { loading: boolean; height?: number; width?: number }): JSX.Element => {
  return (
    <Box height={height} width={width} position="relative" sx={{ zIndex: 100 }}>
      <Box position="relative" height="100%" width="100%">
        <BounceLoader
          color={theme.palette.grey[400]}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </Box>
    </Box>
  )
};

export default LocalSpinner;