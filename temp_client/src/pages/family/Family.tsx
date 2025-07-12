import React from 'react';
import { Box } from '@mui/material';
import Page from '@components/common/Page';

const Family = ({ updateUser }: any): JSX.Element => {
  return (
    <Page
      title="My Family!"
      subtitle="Use nav bar for now">
      <Box className="m-auto h-100" />
    </Page>
  )
}

export default Family;