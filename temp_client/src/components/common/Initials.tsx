import React from 'react';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import { Trans } from '@lingui/macro';

const Initials = ({ firstName, lastName, size = 25, bg }: { firstName: string, lastName: string, bg?: string, size?: number }) => {
  const theme = useTheme();
  const MemberInitials = styled(Box)`
    align-items: center;
    background-color: hsl(from  ${theme.palette.info.contrastText} h s l / 0.5);
    border-radius: 50%;
    border: .5px solid ${theme.palette.info.main};
    color: ${theme.palette.info.main};
    display: flex;
    font-size: ${size / 2};
    justify-content: center;
    padding: .5em;
  `;

  return (
    <Tooltip title={<Trans>double_click_for_more</Trans>}>
      <MemberInitials>
        <Typography variant='body2'>{firstName?.charAt(0)?.toUpperCase()}{lastName?.charAt(0)?.toUpperCase()}</Typography>
      </MemberInitials>
    </Tooltip>
  );
}

export default Initials;