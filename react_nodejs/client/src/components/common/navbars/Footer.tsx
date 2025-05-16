import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Dayjs from 'dayjs';

const Footer = () => {
  const seasonalTheme = useTheme();

  return (
    <Box sx={{
      height: 40,
      width: "100vw",
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      bottom: 0,
      left: 0,
      background: seasonalTheme.palette.text.primary,
      padding: "1rem"
    }}>
      <Typography variant="caption">V1</Typography>
      <Typography variant="caption">{Dayjs().format('MM-YYYY')}</Typography>
    </Box>
  );
}

export default Footer;