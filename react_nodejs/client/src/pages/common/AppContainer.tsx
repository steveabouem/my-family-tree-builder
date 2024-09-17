import React, { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DeepPartial } from "redux";
import { Trans, useLingui } from "@lingui/react";
import Authentication from "../auth/Authentication";
import TopNav from "./navbars/TopNav";
import { DAuthMode } from "../auth/definitions";
import UserProfilePage from "../user/Profile";
import Footer from "./navbars/Footer";
import BuildFamilyTree from "../tree/BuildFamilyTree";
import Family from "../family/Family";
import FTLandingPage from "../../components/FT.Landing";
import { DUserDTO } from "../../services/auth/auth.definitions";
import GlobalContext from "../../context/creators/global.context";
import { Container } from "react-bootstrap";
import ViewFamilyTree from "../tree/ViewFamilyTree";
import('./styles.scss');

const AppContainer = (): JSX.Element => {
  const [currentUser, setCurrentUser] = React.useState<DeepPartial<DUserDTO>>({});
  const [mode, setMode] = React.useState<DAuthMode | undefined>();
  const [throwError, setThrowError] = React.useState<boolean>(false);
  const { theme } = React.useContext(GlobalContext);

  React.useEffect(() => {
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
    <Container fluid id="FT" className={theme}>
      <TopNav />
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
          <Route path="users/:id" element={<UserProfilePage />} />
          {/* <Route path="family" element={<Family />} /> */}
          <Route path="family-trees/:id" element={<ViewFamilyTree />} />
          <Route path="family-trees/manage" element={<BuildFamilyTree />} />
          <Route path='*' element={<FTLandingPage />} />
        </Routes>
      </div>
      <Footer />
    </Container>
  );
}

export default AppContainer;