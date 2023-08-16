import React, { useContext, useEffect, useState } from "react";
import { DAppProps } from "./common.definitions"
import FTLandingPage from "../FT.Landing";
import { Route, Routes } from "react-router-dom";
import { DUserDTO } from "../../../services/FT/auth/auth.definitions";
import FTAuthentication from "../auth/Authentication";
import { DeepPartial } from "redux";
import TopNav from "../../common/navbars/TopNav";
import { FTLinkEnums } from "../../common/definitions";
import { DAuthMode } from "../auth/definitions";
import FTUserProfilePage from "../user/FT.Profile";
import FTFamily from "../family/FT.Family";
import FamilyTreeContext from "../../../context/FT/familyTree.context";
import GlobalContext, { applicationEnum, themeEnum } from "../../../context/global.context";
import Footer from "../../common/navbars/Footer";
import('../../common/styles.scss');

const appLinks = [
  { link: 'My Profile', path: FTLinkEnums.user },
  { link: 'My Tree', path: FTLinkEnums.familyTree },
  { link: 'My Family', path: FTLinkEnums.family },
];

const FTAppContainer = ({ children }: DAppProps): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<DeepPartial<DUserDTO>>({});
  const [mode, setMode] = useState<DAuthMode | undefined>();
  const [throwError, setThrowError] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<themeEnum>(themeEnum.light);
  const [sessionData, setSessionData] = useState<string | undefined>();

  useEffect(() => {
    if (!currentUser.email && !mode) {
      setMode('register');
    }
  }, [currentUser, mode]);

  const updateFormMode = (mode?: DAuthMode) => {
    setMode(mode);
  }

  const updateErrorStatus = (error: boolean) => {
    setThrowError(error);
  }

  const updateUser = (user?: Partial<DUserDTO>) => {
    if (user)
      setCurrentUser(user);
  }

  const switchTheme = (selected: themeEnum) => {
    setCurrentTheme(selected);
  }

  return (
    <GlobalContext.Provider
      value={{
        app: applicationEnum.FT,
        theme: currentTheme,
        session: sessionData
      }}>
      <>
        <TopNav links={appLinks} position="" handleChangeTheme={switchTheme} />
        <div id="FT" className={currentTheme}>
          <FamilyTreeContext.Provider
            value={
              {
                currentUser: currentUser, family: {}, tree: {},
                error: throwError, updateUser
              }
            }>
            <div className="scroll">
              <Routes>
                <Route path="/home" element={<FTLandingPage />} />
                <Route path="/users/:id" element={<FTUserProfilePage />} />
                <Route path={`${FTLinkEnums.family}`} element={<FTFamily />} />
                <Route path="/" element={
                  <FTAuthentication
                    changeMode={(mode: DAuthMode | undefined) => updateFormMode(mode)}
                    mode={mode}
                  />
                }
                />
              </Routes>
            </div>
          </FamilyTreeContext.Provider>
        </div>
      </>
      <Footer />
    </GlobalContext.Provider>
  );
}

export default FTAppContainer;