import React, {useState, useEffect} from "react";
import {StyledNav} from "./styles";
import logo from "../../../public/media/elephant.png";
import avatar from "../../../public/media/male_user_large.png";
import {NavLink} from "react-bootstrap";
import { useDispatch, connect } from "react-redux";
import UserMenu from "./UserMenu";
import {PROFILE_ACTIONS} from "../../../redux/actions";

 const TopNav = ({currentUser}) => {
    const [menuOpened, setMenuOpened] = useState(false);
    const dispatch = useDispatch();
    const user = dispatch(PROFILE_ACTIONS.getUser());
    useEffect(() => {
        if (window.user) {

            dispatch(PROFILE_ACTIONS.setUser(window.user));
        }

    }, [currentUser, window.user]);

    return (
        <StyledNav>
            <div className="position-relative topnav-section">
                <div className="top-logo-label">Zogh Tracker</div>
                <img src={logo} className="top-logo-main" alt="App Logo"/>
            </div>
            <div className="topnav-section">
                <div>
                    <NavLink href="/my-household">household</NavLink>
                </div>
                <div>
                    <NavLink href="">goals</NavLink>
                </div>
                <div>
                    <NavLink href="">tasks</NavLink>
                </div>
                <div className="position-relative">
                    <div className="avatar-container green hover" onClick={() => setMenuOpened(!menuOpened)}>
                        <img className="user-avatar-top" src={avatar} alt="User Avatar" />
                    </div>
                </div>
            </div>
            {menuOpened && (
                <UserMenu
                    user={user}
                    opened={menuOpened}
                    setOpened={() => setMenuOpened(!menuOpened)}
                />
            )}
        </StyledNav>
    );
};

 const mapStateToProps = (state) => ({
    currentUser: state.currentUser,
 });

 const mapDispatchToProps = () => ({});

 export default connect(mapStateToProps, mapDispatchToProps)(TopNav)