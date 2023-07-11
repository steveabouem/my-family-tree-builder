import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DNavigationLink, DTopNavProps } from "../definitions";
import logo from "../../../assets/logo.jpg";
import ThemeSelector from "../../FT/common/ThemeSelector";

const TopNav = ({ links, position, handleChangeTheme }: DTopNavProps) => {
  const [menuOpened, setMenuOpened] = useState(false);


  return (
    <div className="navigation">
      <div className="logo-container">
        <span>Zogh</span><img src={logo} alt="app logo" />
      </div>
      <div className="topnav-section">
        {
          links.map(({ link, path }: DNavigationLink) => (
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
      <ThemeSelector switchTheme={handleChangeTheme} />
      {menuOpened && (
        <div>MENU</div>
      )}
    </div>
  );
};

export default TopNav