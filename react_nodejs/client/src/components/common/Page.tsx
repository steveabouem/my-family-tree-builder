import React from "react";
import { Box, Typography } from '@mui/material';
import { DPageProps } from "./definitions";
import Spinner from "./progressIndicators/Spinner";
import useSessionValidation from "../../pages/hooks/useAuthValidation";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "contexts/creators/global/global.context";
import theme from "utils/material/theme";
import('./styles.scss');

const Page = ({ title, subtitle, children, loading, bg }: DPageProps): JSX.Element => {
  useSessionValidation();
  const { modal } = React.useContext(GlobalContext);

  return (
    <React.Suspense fallback={<Spinner loading={true} />}>
      <Box height="calc(100vh - 90px)" width="100%" className="app-page" overflow="hidden scroll" mt="50px" p={4} sx={{ backgroundImage: `url(${bg || ''})`, backgroundSize: 'cover' }}>
        <Typography variant="h3" color={theme.palette.primary.main}>{title}</Typography>
        {subtitle ? <Typography variant="h4" color="">{subtitle}</Typography> : ''}
        <Spinner loading={!!loading} />
        {children || null}
        <BaseModal
          type="info"
          hidden={modal?.hidden || true} id={modal?.id || ''}
          title={modal?.title || ''} content={modal?.content || ''}
          buttons={{ cancel: modal?.buttons?.cancel || false, confirm: modal?.buttons?.confirm || false }}
        />
      </Box>
    </React.Suspense>
  );
};

export default Page;