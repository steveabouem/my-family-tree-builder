import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DeepPartial } from "redux";
import { Container } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TopNav from "./navbars/TopNav";
import Footer from "./navbars/Footer";
import FTLandingPage from "../FT.Landing";
import PageUrlsEnum from "utils/urls/";
import UserProfilePage from "pages/user/profile";
import ThemingTest from "pages/ThemingTest";
import FamilyTreeDashboard from "pages/tree/dashboard";
import AuthenticationPage from "pages/auth";
import CreateFamilyTreePage from "pages/tree/create";
import { DAuthMode, User } from "types";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "app/store";

const AppContainer = (): JSX.Element => {
  const [currentUser] = useState<DeepPartial<User>>({});
  const [mode, setMode] = useState<DAuthMode | undefined>();

  const queryClient = new QueryClient();
  useEffect(() => {
    if (!currentUser.email && !mode) {
      setMode('register');
    }
  }, [currentUser, mode]);

  const updateFormMode = (mode?: DAuthMode) => {
    setMode(mode);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PersistGate loading={null} persistor={persistor}>
        <>
          <TopNav />
          <Container maxWidth="xl" sx={mainContainerStyle} className="main-container-app">
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
              <Route path={PageUrlsEnum.trees} element={<FamilyTreeDashboard />} />
              <Route path={PageUrlsEnum.newTree} element={<CreateFamilyTreePage />} />
              <Route path={PageUrlsEnum.viewTree} element={<CreateFamilyTreePage />} />
              <Route path={PageUrlsEnum.themeTest} element={<ThemingTest />} />
              <Route path="*" element={<FTLandingPage />} />
            </Routes>
          </Container>
          <Footer />
        </>
      </PersistGate>
    </QueryClientProvider>
  );
};

const mainContainerStyle = {
  height: "calc(100vh - 70px)",
  width: "100vw",
  overflow: "hidden",
  padding: "0",
  paddingRight: "0!important",
  paddingLeft: "0!important",
};

export default AppContainer;