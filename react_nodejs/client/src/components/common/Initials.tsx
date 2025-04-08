import React from 'react';
import { Box } from '@mui/material';

const Initials = ({ firstName, lastName, size = 25, bg }: { firstName: string, lastName: string, bg?: string, size?: number }) => {

  return (
    <Box height={size}>
      <Box
        sx={{
          width: size,
          height: size,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: bg || 'white',
          borderRadius: '50%',
          fontSize: size / 2,
        }}
      >
        {firstName?.charAt(0)?.toUpperCase()}{lastName?.charAt(0)?.toUpperCase()}
      </Box>
    </Box>
  );
}

export default Initials;