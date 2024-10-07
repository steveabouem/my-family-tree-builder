import React from "react";
import Dayjs from 'dayjs';
import { Box, Typography } from "@mui/material";
import theme from "utils/material/theme";

const Footer = () => {
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
      background: theme.palette.success.main,
      padding: "1rem"
    }}>
      <Typography variant="caption" color="info">V1</Typography>
      <Typography variant="caption" color="info">{Dayjs().format('MM-YYYY')}</Typography>
    </Box>
  );
}

export default Footer;