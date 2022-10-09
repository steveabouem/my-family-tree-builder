import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

const NotFound = () => (
    <main>
        <FontAwesomeIcon icon={faTriangleExclamation} />
        <p>There's nothing here!</p>
    </main>
);

export default NotFound;