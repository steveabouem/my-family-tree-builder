import React, { useContext } from "react";
import { Box, Typography, useTheme } from '@mui/material';
import { PageProps } from "types";
import Spinner from "./progressIndicators/Spinner";
import useSessionValidation from "../../pages/hooks/useAuthValidation";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "contexts/creators/global/global.context";
import { BackIcon } from "utils/assets/icons";
import { Link } from "react-router-dom";

const Page = ({ title, subtitle, children, loading, bg, prevUrl }: PageProps): JSX.Element => {
  useSessionValidation();
  const { modal } = useContext(GlobalContext);
  const seasonalTheme = useTheme();


  return (
    <React.Suspense fallback={<Spinner loading={true} />}>
      <Box height="calc(100vh - 90px)" width="100%" className="app-page" overflow="hidden scroll" mt="50px" p={4} sx={{ backgroundImage: `url(${bg || ''})`, backgroundSize: 'cover', position: 'relative' }}>
        {/* <Box className="section-top" /> use for gradient effect */}
        {prevUrl && <Link to={`${prevUrl}`} style={{
          position: 'absolute',
          top: '10px',
          left: '22px',
          display: 'flex',
          height: '30px',
          width: '30px',
        }}><BackIcon color={seasonalTheme.palette.primary.contrastText} /> </Link>}
        <Box className="section-main">
          <Typography variant="h3" color={seasonalTheme.palette.primary.main}>{title}</Typography>
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
        {/* <Box className="section-bottom" /> */}
      </Box>
    </React.Suspense>
  );
};

export default Page;