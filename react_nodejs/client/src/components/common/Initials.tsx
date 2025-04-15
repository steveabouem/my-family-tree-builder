import React from 'react';
import { Box } from '@mui/material';

const Initials = ({ firstName, lastName, size = 25, bg }: { firstName: string, lastName: string, bg?: string, size?: number }) => {
  return (
    <Box height={size} display="flex" alignItems="center" justifyContent="center">
      <Box
        sx={{
          display: 'flex',
          padding: '.5em',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: bg || 'white',
          borderRadius: '50%',
          border: '1px solid #8c7272',
          fontSize: size / 2,
          color: '#8c7272'
        }}
      >
        {firstName?.charAt(0)?.toUpperCase()}{lastName?.charAt(0)?.toUpperCase()}
      </Box>
    </Box>
  );
}

export default Initials;