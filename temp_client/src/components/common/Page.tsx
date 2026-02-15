import React, { useContext } from "react";
import { Box, Typography } from '@mui/material';
import { PageProps } from "types";
import Spinner from "./progressIndicators/Spinner";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "contexts/creators/global/global.context";

const Page = ({ title, subtitle, children, loading, bg, prevUrl }: PageProps): JSX.Element => {
  const { modal } = useContext(GlobalContext);

  return (
    <React.Suspense fallback={<Spinner loading={true} />}>
      <Box
        height="calc(100vh - 90px)" width="100%" className="app-page"
        overflow="hidden scroll" mt="50px" ml={0} mr={0}
        sx={{ backgroundImage: `url(${bg || ''})`, backgroundSize: 'cover' }}
      >
        <Box className="page-sections" width="75%" m="auto" sx={{position: 'relative'}}>
          {/* <Box className="section-top" /> use for gradient effect */}
          {/* {prevUrl && <Link to={`${prevUrl}`} style={{
            position: 'absolute',
            top: '10px',
            left: '22px',
            display: 'flex',
            height: '30px',
            width: '30px',
          }}><BackIcon color={seasonalTheme.palette.primary.contrastText} /> </Link>} */}
          <Box className="section-main">
            <Typography variant="h3">{title}</Typography>
            {subtitle ? <Typography variant="h4">{subtitle}</Typography> : ''}
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
      </Box>
    </React.Suspense>
  );
};

export default Page;