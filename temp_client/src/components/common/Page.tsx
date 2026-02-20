import React, { useContext } from "react";
import { Box, Typography } from '@mui/material';
import { PageProps } from "types";
import Spinner from "./progressIndicators/Spinner";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "contexts/creators/global/global.context";
import styled from "styled-components";
import { keyframes } from "styled-components";

const Page = ({ title, subtitle, children, loading, bg, prevUrl }: PageProps): JSX.Element => {
  const { modal } = useContext(GlobalContext);

  return (
      <FadeInPage className="app-page"
        sx={{ backgroundImage: `url(${bg || ''})`, backgroundSize: 'cover' }}
      >
        <Box className="page-sections" width="75%" m="0 calc(12.5% - 20px) 0 12.5%" sx={{ position: 'relative' }}>
          {/* <Box className="section-top" /> use for gradient effect */}
          {/* {prevUrl && <Link to={`${prevUrl}`} style={{
            position: 'absolute',
            top: '10px',
            left: '22px',
            display: 'flex',
            height: '30px',
            width: '30px',
          }}><BackIcon color={seasonalTheme.palette.primary.contrastText} /> </Link>} */}
          <Box>
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
      </FadeInPage>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FadeInPage = styled(Box)`
  animation: ${fadeIn} .4s ease;
  height: calc(100% - 70px);
  width: 100%;
  overflow: hidden scroll;
  margin: 60px 0 0 0;
`;


export default Page;