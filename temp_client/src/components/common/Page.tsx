import React, { useContext } from "react";
import { Box, Typography } from '@mui/material';
import styled from "styled-components";
import { PageProps } from "types";
import Spinner from "./progressIndicators/Spinner";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "contexts/creators/global/global.context";
import { keyframes } from "styled-components";

const Page = ({ title, subtitle, children, loading, error }: PageProps): JSX.Element => {
  const { modal } = useContext(GlobalContext);
  const bgStyles = {
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    left: '0px',
    backgroundSize: 'cover',
    backgroundBlendMode: 'overlay',
    backgroundPosition: '22% 22%',
  };

  if (error) {
    return <div>ERROR</div>;
  }

  return (
    <>
      <Box sx={bgStyles} />
      <FadeInPage className="app-page">
        <Section className="page-sections">
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
        </Section>
      </FadeInPage>
    </>
  );
};

const fadeIn = keyframes`
  from {
    opacity: .5;
    background: black;
    width: 200vw;
  }
`;
const FadeInPage = styled(Box)`
  animation: ${fadeIn} .5s ease;
  width: 100%;
`;
const Section = styled(Box)`
  width: 75%;
  margin: 0 calc(12.5% - 20px) 0 12.5%;
  position: relative;
`;
export default Page;