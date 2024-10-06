import React from "react";
import {Container, Typography} from '@mui/material';
import { DPageProps } from "./definitions";
import Spinner from "./Spinner";
import useSessionValidation from "../hooks/useAuthValidation";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "contexts/creators/global/global.context";
import theme from "utils/material/theme";

const Page = ({ title, subtitle, children }: DPageProps): JSX.Element => {
  useSessionValidation();
  const { modal, loading } = React.useContext(GlobalContext);

  return (
    <React.Suspense fallback={<Spinner loading={true} />}>
      <Container maxWidth="xl">
        <Typography variant="h4" color={theme.palette.primary.main}>{title}</Typography> 
        {subtitle ? <Typography variant="h5" color="">{subtitle}</Typography> : ''}
        <Spinner loading={loading} /> 
        {children || null}
        <BaseModal
          hidden={modal?.hidden || true} id={modal?.id || ''}
          title={modal?.title || ''} content={modal?.content || ''}
          buttons={{ cancel: modal?.buttons?.cancel || false, confirm: modal?.buttons?.confirm || false }}
        />
      </Container>
    </React.Suspense>
  );
};

export default Page;