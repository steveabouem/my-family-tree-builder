import { Box, useTheme } from "@mui/material";
import React from "react";
import { BounceLoader } from "react-spinners";

const LocalSpinner = ({ loading, height = 90, width = 90, size = 150 }: { loading: boolean; height?: number; width?: number , size?: number}): JSX.Element => {
    const seasonalTheme = useTheme();
  
  return (
    <Box sx={spinnerContainerStyles}>
      <Box height={height} width={width}>
        <BounceLoader
          color={seasonalTheme.palette.grey[400]}
          loading={loading}
          size={size}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </Box>
    </Box>
  )
};

const spinnerContainerStyles = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
  height: '100%',
  width: '100%',
  zIndex: 10,
  background: '#56585a47'
};

export default LocalSpinner;