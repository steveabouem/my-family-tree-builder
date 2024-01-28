import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DeepPartial } from "redux";
import { useLingui } from "@lingui/react";
import Authentication from "../auth/Authentication";
import TopNav from "./navbars/TopNav";
import { DAuthMode } from "../auth/definitions";
import UserProfilePage from "../user/Profile";
import Footer from "./navbars/Footer";
import Tree from "../tree/Tree";
import Family from "../family/Family";
import FTLandingPage from "../FT.Landing";
import { DUserDTO } from "../../services/auth/auth.definitions";
import GlobalContext from "../../context/creators/global.context";
import('./styles.scss');

const AppContainer = (): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<DeepPartial<DUserDTO>>({});
  const [mode, setMode] = useState<DAuthMode | undefined>();
  const [throwError, setThrowError] = useState<boolean>(false);
  const { i18n } = useLingui();
  const { theme } = useContext(GlobalContext);

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
    console.log('REceiving user: ', user);

    if (user) {
      // @ts-ignore
      setCurrentUser(prev => {
        if (prev !== user) {

          return { ...user };
        }
      });
    }
  }

  return (
    <>
      <TopNav />
      <div id="FT" className={theme}>
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
            <Route path="family" element={<Family updateUser={updateUser} />} />
            <Route path="family-tree" element={<Tree updateUser={updateUser} />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AppContainer;