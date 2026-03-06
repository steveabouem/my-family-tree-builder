import React, { useState } from "react";
import { BaseMenuProps, MenuItem } from "types";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";

const BaseMenu = (props: BaseMenuProps): JSX.Element => {

  return (
    <Box className="menu">
      <Box className="menu-items">
        {/* {props?.children?.map((c: MenuItem, i:number) => (
          <Box className="menu-item" key={`menu-item-${i}`}>
            <Link to={c.link}>{c.title}</Link>
          </Box>
        ))} */}
      </Box>
    </Box>
  )
}

export default BaseMenu;