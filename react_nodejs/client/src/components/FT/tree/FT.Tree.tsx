import React, { useContext } from 'react';
import Page from '../../common/Page';
import GlobalContext from '../../../context/global.context';

const FTTree = (): JSX.Element => {
  const { theme } = useContext(GlobalContext);
  return (
    <Page title="My Tree" subtitle="" isLoading={false} theme={theme} />
  )
}

export default FTTree;