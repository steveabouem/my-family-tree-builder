import React, { ReactNode } from 'react';
import { Box, Typography} from '@mui/material';

const DataProgress = ({ bg, sx, msg }: { msg: ReactNode, bg?: ReactNode, sx?: { [key: string]: string } }) => {
  return (
    <Box sx={{
      position: 'relative',
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      backgroundImage: `url(${bg})`,
      backgroundSize: '100% 100%',
      backgroundBlendMode: 'overlay',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#fff6f6c9',
      padding: '1rem',
      ...sx
    }}
    >
      <Typography variant="body2">{msg}</Typography>
    </Box >
  )
};

export default DataProgress