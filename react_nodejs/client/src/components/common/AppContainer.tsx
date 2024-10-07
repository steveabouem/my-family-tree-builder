import React from "react";
import { Route, Routes } from "react-router-dom";
import { DeepPartial } from "redux";
import TopNav from "./navbars/TopNav";
import { DAuthMode } from "../../pages/auth/definitions";
import UserProfilePage from "../../pages/user/Profile";
import Footer from "./navbars/Footer";
import BuildFamilyTree from "../../pages/tree/BuildFamilyTree";
import FTLandingPage from "../FT.Landing";
import { DUserDTO } from "../../services/auth/auth.definitions";
import ViewFamilyTree from "../../pages/tree/ViewFamilyTree";
import Authentication from "pages/auth/Authentication";
import { Container } from "@mui/material";
// import('./styles.scss');

const AppContainer = (): JSX.Element => {
  const [currentUser, setCurrentUser] = React.useState<DeepPartial<DUserDTO>>({});
  const [mode, setMode] = React.useState<DAuthMode | undefined>();
  const [throwError, setThrowError] = React.useState<boolean>(false);

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
    <Container maxWidth="xl" sx={{height: "100vh", width: "100vw", overflow: "hidden", padding: "0"}} className="main-container-app">
      <TopNav />
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
      <Footer />
    </Container>
  );
}

export default AppContainer;