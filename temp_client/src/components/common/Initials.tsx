import React from 'react';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import { Trans } from '@lingui/macro';

const Initials = ({ firstName, lastName, size = 25, bg }: { firstName: string, lastName: string, bg?: string, size?: number }) => {
  const theme = useTheme();


  return (
    <Tooltip title={<Trans>double_click_for_more</Trans>}>
      <MemberInitials theme={theme}>
        <Typography variant='body2'>{firstName?.charAt(0)?.toUpperCase()}{lastName?.charAt(0)?.toUpperCase()}</Typography>
      </MemberInitials>
    </Tooltip>
  );
}

  const MemberInitials = styled(Box)<{theme: any}>`
    align-items: center;
    background-color: ${(props: any) => `hsl(from  ${props.theme.palette.primary.main} h s l / 0.5)`};
    border-radius: 50%;
    border:  ${(props: any) => `.5px solid ${props.theme.palette.info.main}`};
    color: ${(props: any) => props.theme.palette.info.main};
    display: flex;
    font-size: 12px;
    justify-content: center;
    padding: .5em;
  `;

export default Initials;