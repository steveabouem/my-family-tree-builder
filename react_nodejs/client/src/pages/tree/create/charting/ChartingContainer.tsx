import React, { useContext, useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import Page from '../../../../components/common/Page';
import GlobalContext from 'contexts/creators/global/global.context';
import GenealogyContainer from '../genealogy/GenealogyContainer';
import ChartingForm from './ChartingForm';

const ChartingContainer = (): JSX.Element => {
  

  return (
    <ChartingForm />
  );
}

export default ChartingContainer;