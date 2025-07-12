import React, { useState } from "react";
import { DBaseMenuProps, DMenuItem } from "./definitions";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const BaseMenu = (props: DBaseMenuProps): JSX.Element => {

  return (
    <Box className="menu">
      <Box className="menu-items">
        {/* {props?.children?.map((c: DMenuItem, i:number) => (
          <Box className="menu-item" key={`menu-item-${i}`}>
            <Link to={c.link}>{c.title}</Link>
          </Box>
        ))} */}
      </Box>
    </Box>
  )
}

export default BaseMenu;