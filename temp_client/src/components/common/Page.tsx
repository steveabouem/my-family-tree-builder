import React, { useContext } from "react";
import { Box, Paper, Typography } from '@mui/material';
import styled from "styled-components";
import { PageProps } from "types";
import Spinner from "./progressIndicators/Spinner";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "contexts/creators/global/global.context";
import { keyframes } from "styled-components";
import NotFound from "./404NotFound";
import NotAllowed from "./NotAllowed";

const Page = ({ title, subtitle, children, loading, code, error, reload }: PageProps): JSX.Element => {
  const { modal } = useContext(GlobalContext);
  const contentNotAllowed = code === 403;

  return (
    <FadeInPage className="app-page">
      <Section className="page-sections">
        <Box>
          <Typography variant="h3">{title}</Typography>
          {subtitle ? <Typography variant="h4">{subtitle}</Typography> : ''}
          {contentNotAllowed ? (
            <NotAllowed />
          ) : error ? (
            <Paper sx={{ width: '70%', margin: 'auto' }}>
              <NotFound handleReload={() => { reload?.() }} />
            </Paper>
          ) : (
            <>
              <Spinner loading={!!loading} />
              {children || null}
              <BaseModal
                type="info"
                hidden={modal?.hidden || true} id={modal?.id || ''}
                title={modal?.title || ''} content={modal?.content || ''}
                buttons={{ cancel: modal?.buttons?.cancel || false, confirm: modal?.buttons?.confirm || false }}
              />
            </>
          )}
        </Box>
      </Section>
    </FadeInPage>
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