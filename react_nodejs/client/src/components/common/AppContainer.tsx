import React, { ReactNode, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DeepPartial } from "redux";
import { useLingui } from "@lingui/react";
import Authentication from "../auth/Authentication";
import TopNav from "./navbars/TopNav";
import { DAuthMode } from "../auth/definitions";
import UserProfilePage from "../user/FT.Profile";
import FamilyTreeContext from "../../context/familyTree.context";
import Footer from "./navbars/Footer";
import Tree from "../tree/Tree";
import Family from "../family/Family";
import { applicationEnum, themeEnum } from "../../context/definitions";
import GlobalContext from "../../context/global.context";
import FTLandingPage from "../FT.Landing";
import { DUserDTO } from "../../services/auth/auth.definitions";
import('./styles.scss');

const AppContainer = ({ children }: { children?: ReactNode}): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<DeepPartial<DUserDTO>>({});
  const [mode, setMode] = useState<DAuthMode | undefined>();
  const [throwError, setThrowError] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<themeEnum>(themeEnum.light);
  const [sessionData, setSessionData] = useState<string | undefined>();
  const {i18n} = useLingui();

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
    // console.log('REceiving user: ', user);

    if (user) {
      // @ts-ignore
      setCurrentUser(prev => {
        if (prev !== user) {

          return { ...user };
        }
      });
    }
  }

  const switchTheme = (selected: themeEnum) => {
    setCurrentTheme(selected);
  }

  return (
    <GlobalContext.Provider
      value={{
        app: applicationEnum.FT,
        theme: currentTheme,
        session: sessionData,
      }}>
      <TopNav position="" handleChangeTheme={switchTheme} />
      <div id="FT" className={currentTheme}>
        <FamilyTreeContext.Provider
          value={
            {
              currentUser: currentUser, family: {}, tree: {},
              error: throwError, updateUser: updateUser
            }
          }>
          <div className="scroll">
            <Routes>
            <Route path="/" element={<FTLandingPage />} />
              <Route path="/connect" element={
                <Authentication
                  changeMode={updateFormMode}
                  mode={mode}
                />
              }
              />
              <Route path="users/:id" element={<UserProfilePage updateUser={updateUser} />} />
              <Route path="family" element={<Family updateUser={updateUser} />}  />
              <Route path="family-tree" element={<Tree updateUser={updateUser} />}  />
            </Routes>
          </div>
        </FamilyTreeContext.Provider>
      </div>
      <Footer />
    </GlobalContext.Provider>

  );
}

export default AppContainer;