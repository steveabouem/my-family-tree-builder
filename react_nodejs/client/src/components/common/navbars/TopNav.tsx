import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DNavigationLink, DTopNavProps } from "../definitions";

const TopNav = ({ links, position }: DTopNavProps) => {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <div>
      <div className="position-relative topnav-section">
        <div className="top-logo-label">lorem ipsum title</div>
      </div>
      <div className="topnav-section">
        {
          links.map(({link, path}: DNavigationLink) => (
            <div>
              <Link to={path}>{link}</Link>
            </div>))
        }

        <div className="position-relative">
          <div className="avatar-container green hover" onClick={() => setMenuOpened(!menuOpened)}>
            {/* <img className="user-avatar-top" src={avatar} alt="User Avatar" /> */}
          </div>
        </div>
      </div>
      {menuOpened && (
        <div>MENU</div>
      )}
    </div>
  );
};

export default TopNav