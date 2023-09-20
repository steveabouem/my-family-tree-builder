import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { DTopNavProps } from "../definitions";
import logo from "../../../assets/logo.jpg";
import { LiaUserSecretSolid } from "react-icons/lia";
import {RiUser5Fill} from "react-icons/ri";
import ThemeSelector from "../../FT/common/ThemeSelector";
import usePrimary from "../../hooks/usePrimary.hook";
import GlobalContext from "../../../context/global.context";
import FamilyTreeContext from "../../../context/FT/familyTree.context";

const TopNav = ({ position, handleChangeTheme }: DTopNavProps) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const linkColor = usePrimary();
  const { theme } = useContext(GlobalContext);
  const { currentUser } = useContext(FamilyTreeContext);

  return (
    <div className={"navigation " + theme}>
      <div className="logo-container">
        <span>Zogh</span><img src={logo} alt="app logo" />
      </div>
      <div className="pages-links">

        <div className="accent">
          <Link to="/" color={linkColor}>Home</Link>
        </div>

        <div className="accent">
          <Link to="/users/:id" color={linkColor}>Profile</Link>
        </div>

        <div className="accent">
          <Link to="/family" color={linkColor}>Families</Link>
        </div>

        <div className="accent">
          <Link to="/familyTree" color={linkColor}>Trees</Link>
        </div>

        <div className="accent">
          <Link to="/connect" color={linkColor}>Connect</Link>
        </div>
      </div>
      <div className="avatar-container" onClick={() => setMenuOpened(!menuOpened)}>
        {currentUser?.first_name ? <div><RiUser5Fill / >  {currentUser?.first_name}</div> : <LiaUserSecretSolid />}
      </div>
      <ThemeSelector switchTheme={handleChangeTheme} />
      {menuOpened && (
        <div>MENU</div>
      )}
    </div>
  );
};

export default TopNav