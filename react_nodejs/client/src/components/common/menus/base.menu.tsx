import React, { useState } from "react";
import { DBaseMenuProps, DMenuItem } from "./definitions";
import { Link } from "react-router-dom";

const BaseMenu = (props: DBaseMenuProps): JSX.Element => {

  return (
    <div className="menu">
      <div className="menu-items">
        {/* {props?.children?.map((c: DMenuItem, i:number) => (
          <div className="menu-item" key={`menu-item-${i}`}>
            <Link to={c.link}>{c.title}</Link>
          </div>
        ))} */}
      </div>
    </div>
  )
}

export default BaseMenu;