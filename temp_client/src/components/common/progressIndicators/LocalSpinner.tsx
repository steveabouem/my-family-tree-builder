import { Box, useTheme } from "@mui/material";
import React from "react";
import { BounceLoader } from "react-spinners";

const LocalSpinner = ({ loading, height = 90, width = 90 }: { loading: boolean; height?: number; width?: number }): JSX.Element => {
    const seasonalTheme = useTheme();
  
  return (
    <Box height={height} width={width} position="relative" sx={{ zIndex: 100 }}>
      <Box position="relative" height="100%" width="100%">
        <BounceLoader
          color={seasonalTheme.palette.grey[400]}
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