import React, { useEffect, useState, createContext } from "react";
import { DAppProps } from "./common.definitions"
import FTLandingPage from "../FT.Landing";
import { Outlet, Route, Routes } from "react-router-dom";
import { DUserDTO } from "../../../services/FT/auth/auth.definitions";
import FTAuthentication from "../auth/Authentication";
import { DeepPartial } from "redux";
import TopNav from "../../common/navbars/TopNav";
import { FTLinkEnums } from "../../common/definitions";
import { DAuthMode } from "../auth/definitions";
import FTUserProfilePage from "../user/FT.Profile";
import FTFamily from "../family/FT.Family";
import FamilyTreeContext from "../../../context/FT/familyTree.context";

const appLinks = [
  { link: 'My Profile', path: FTLinkEnums.user },
  { link: 'My Tree', path: FTLinkEnums.familyTree },
  { link: 'My Family', path: FTLinkEnums.family },
];

const FTAppContainer = ({ children }: DAppProps): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<DeepPartial<DUserDTO>>({});
  const [mode, setMode] = useState<DAuthMode | undefined>();
  const [throwError, setThrowError] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser.email && !mode) {
      setMode('register');
    }
  }, [currentUser, mode]);

  const updateFormMode = (p_mode?: DAuthMode) => {
    setMode(p_mode);
  }

  const updateErrorStatus = (p_error: boolean) => {
    setThrowError(p_error);
  }

  const updateUser = (p_user?: Partial<DUserDTO>) => {
    if (p_user)
      setCurrentUser(p_user);
  }

  return (
    <div id="FT">
      FT
      <FamilyTreeContext.Provider
        value={
          {
            currentUser: currentUser, family: {}, tree: {},
            error: throwError, updateUser
          }
        }>
        <TopNav links={appLinks} position="" />
        <div>
          <h2>Content</h2>
          <Routes>
            <Route path="/" element={
              <FTAuthentication
                changeMode={(mode: DAuthMode | undefined) => updateFormMode(mode)}
                mode={mode}
              />
            }
            />
            <Route path="/ft"  element={<FTLandingPage />} />
            <Route path="/ft/users/:id" element={<FTUserProfilePage />} />
            <Route path={`${FTLinkEnums.family}`} element={<FTFamily />} />
          </Routes>
        </div>
      </FamilyTreeContext.Provider>
    </div>
  );
}

export default FTAppContainer;