import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DeepPartial } from "redux";
import { Container } from "@mui/material";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import TopNav from "./navbars/TopNav";
import Footer from "./navbars/Footer";
import FTLandingPage from "../FT.Landing";
import PageUrlsEnum from "utils/urls/";
import UserProfilePage from "pages/user/profile";
import FamilyTreeDashboard from "pages/tree/dashboard";
import ViewFamilyTreeChartPage from "pages/tree";
import AuthenticationPage from "pages/auth";
import CreateFamilyTreePage from "pages/tree/create";
import { DAuthMode,User } from "types";

const AppContainer = (): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<DeepPartial<User>>({});
  const [mode, setMode] = useState<DAuthMode | undefined>();
  const [throwError, setThrowError] = useState<boolean>(false);

  const queryClient = new QueryClient();
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

  const updateUser = (user?: Partial<User>) => {
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
    <QueryClientProvider client={queryClient}>
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
            <Route  path={PageUrlsEnum.trees} element={<FamilyTreeDashboard />} />
            <Route path={PageUrlsEnum.newTree} element={<CreateFamilyTreePage />} />
            <Route path={PageUrlsEnum.viewTree} element={<CreateFamilyTreePage />} />
            <Route path="*" element={<FTLandingPage />} />
          </Routes>
        </Container>
        <Footer />
      </>
    </QueryClientProvider>
  );
}

export default AppContainer;