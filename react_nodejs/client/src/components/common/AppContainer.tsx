import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DeepPartial } from "redux";
import { Container } from "@mui/material";
import TopNav from "./navbars/TopNav";
import Footer from "./navbars/Footer";
import FTLandingPage from "../FT.Landing";
import { DUserDTO } from "services/auth/auth.definitions";
import { DAuthMode } from "pages/auth/definitions";
import PageUrlsEnum from "utils/urls/";
import AuthenticationPage from "pages/auth/";
import UserProfilePage from "pages/user/profile";
import ViewFamilyTreeChartPage from "pages/tree";
import ChartingContainer from "pages/tree/create/charting";

const AppContainer = (): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<DeepPartial<DUserDTO>>({});
  const [mode, setMode] = useState<DAuthMode | undefined>();
  const [throwError, setThrowError] = useState<boolean>(false);

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
      <Container maxWidth="xl" sx={{ height: "100vh", width: "100vw", overflow: "hidden", padding: "0" }} className="main-container-app">
        <Routes>
          <Route path={PageUrlsEnum.home} element={<FTLandingPage />} />
          <Route path={PageUrlsEnum.auth} element={
            <AuthenticationPage
              changeMode={updateFormMode}
              mode={mode}
            />
          }
          />
          <Route path={PageUrlsEnum.user} element={<UserProfilePage />} />
          <Route path={PageUrlsEnum.viewTree} element={<ViewFamilyTreeChartPage />} />
          <Route path={PageUrlsEnum.newTree} element={<ChartingContainer />} />
          <Route path="*" element={<FTLandingPage />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default AppContainer;