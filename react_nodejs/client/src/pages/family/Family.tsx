import Page from 'components/common/Page';
import React from 'react';

const Family = ({ updateUser }: any): JSX.Element => {
  return (
    <Page
      title="My Family!"
      subtitle="Use nav bar for now">
      <Box className="m-auto h-100" style={{ background: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR24NRc3nRtHW5eBM9duHzoBfLZV7mHTC3mqQ&usqp=CAU)' }} />
    </Page>
  )
}

export default Family;