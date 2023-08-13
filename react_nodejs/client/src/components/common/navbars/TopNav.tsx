import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DNavigationLink, DTopNavProps } from "../definitions";
import logo from "../../../assets/logo.jpg";
import {LiaUserSecretSolid} from "react-icons/lia";
import ThemeSelector from "../../FT/common/ThemeSelector";
import usePrimary from "../../hooks/usePrimary.hook";
import GlobalContext from "../../../context/global.context";
import FamilyTreeContext from "../../../context/FT/familyTree.context";

const TopNav = ({ links, position, handleChangeTheme }: DTopNavProps) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const linkColor = usePrimary();
  const {theme} = useContext(GlobalContext);
  const {currentUser} = useContext(FamilyTreeContext);

  return (
    <div className={"navigation " + theme}>
      <div className="logo-container">
        <span>Zogh</span><img src={logo} alt="app logo" />
      </div>
      <div className="pages-links">
        {
          links.map(({ link, path }: DNavigationLink) => (
            <div key={`${link}-link`} className="accent">
              <Link to={path} color={linkColor}>{link}</Link>
            </div>))
        }

      </div>
          <div className="avatar-container" onClick={() => setMenuOpened(!menuOpened)}>
            {/* <img className="user-avatar-top" src={avatar} alt="User Avatar" /> */}
            Guest {currentUser?.first_name ? <div /> : <LiaUserSecretSolid />}
          </div>
      <ThemeSelector switchTheme={handleChangeTheme} />
      {menuOpened && (
        <div>MENU</div>
      )}
    </div>
  );
};

export default TopNav