import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { DeepPartial } from "redux";
import { Container } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import TopNav from "./navbars/TopNav";
import Footer from "./navbars/Footer";
import LandingPage from "../../pages/Landing";
import PageUrlsEnum from "utils/urls/";
import UserProfilePage from "pages/user/profile";
import ThemingTest from "pages/ThemingTest";
import FamilyTreeDashboard from "pages/tree/dashboard";
import AuthenticationPage from "pages/auth";
import CreateFamilyTreePage from "pages/tree/create";
import ViewFamilyMemberPage from "pages/member/ViewFamilyMemberPage";
import { DAuthMode, User } from "types";
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
          <StyledContainer maxWidth="xl" className="main-container-app">
            <Routes>
              <Route path={PageUrlsEnum.home} element={<LandingPage />} />
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
              <Route path={PageUrlsEnum.viewMember} element={<ViewFamilyMemberPage />} />
              <Route path={PageUrlsEnum.viewTree} element={<CreateFamilyTreePage />} />
              <Route path={PageUrlsEnum.themeTest} element={<ThemingTest />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </StyledContainer>
          <Footer />
        </>
      </PersistGate>
    </QueryClientProvider>
  );
};

const StyledContainer = styled(Container)`
  position: relative;
  height: calc(100vh - 100px);
  margin-top: 55px;
  width: 100%;
  min-width: 100%;
  overflow: hidden scroll;
`;

export default AppContainer;