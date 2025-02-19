import React, { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { Box } from '@mui/material';


const NotFound = ({title}: {[key: string]: ReactNode}) => (
    <main className='transparent-bg not-found page'>
        <Box className='header-lg'>{title || 'Page not Found!'}</Box>
        <FontAwesomeIcon icon={faTriangleExclamation} />
    </main>
);

export default NotFound;