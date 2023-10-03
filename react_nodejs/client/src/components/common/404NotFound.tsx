import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'


const NotFound = ({title}: {[key: string]: string}) => (
    <main className='transparent-bg not-found page'>
        <div className='header-lg'>{title || 'Page not Found!'}</div>
        <FontAwesomeIcon icon={faTriangleExclamation} />
    </main>
);

export default NotFound;