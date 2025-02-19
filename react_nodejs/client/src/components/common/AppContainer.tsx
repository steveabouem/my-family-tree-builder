import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DeepPartial } from "redux";
import TopNav from "./navbars/TopNav";
import { DAuthMode } from "../../pages/auth/definitions";
import UserProfilePage from "../../pages/user/Profile";
import Footer from "./navbars/Footer";
import BuildFamilyTree from "../../pages/tree/BuildFamilyTree";
import FTLandingPage from "../FT.Landing";
import { DUserDTO } from "../../services/auth/auth.definitions";
import TreeViewPage from "../../pages/tree/ViewFamilyTree";
import Authentication from "pages/auth/Authentication";
import { Container } from "@mui/material";
// import('./styles.scss');

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
          <Route path="family-trees/:id" element={<TreeViewPage />} />
          <Route path="family-trees/manage" element={<BuildFamilyTree />} />
          <Route path='*' element={<FTLandingPage />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default AppContainer;