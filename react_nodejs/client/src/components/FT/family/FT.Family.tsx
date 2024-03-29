import React, { useContext } from 'react';
import Page from '../../common/Page';
import GlobalContext from '../../../context/global.context';

const FTFamily = (): JSX.Element => {
  const { theme } = useContext(GlobalContext);
  return (
    <Page
      title="My Family!"
      subtitle="Use nav bar for now"
      isLoading={false}
      theme={theme} >
      <div className="m-auto h-100" style={{ background: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR24NRc3nRtHW5eBM9duHzoBfLZV7mHTC3mqQ&usqp=CAU)' }} />
    </Page>
  )
}

export default FTFamily;