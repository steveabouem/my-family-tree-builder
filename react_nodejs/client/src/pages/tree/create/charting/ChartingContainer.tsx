import React, { useContext, useEffect, useState } from 'react';
import { Trans } from '@lingui/macro';
import Page from '../../../../components/common/Page';
import GlobalContext from 'contexts/creators/global/global.context';
import GenealogyContainer from '../genealogy/GenealogyContainer';
import ChartingForm from './ChartingForm';

const ChartingContainer = (): JSX.Element => {
  return (
    <Page subtitle={<Trans>tree_dashboard_page_subtitle</Trans>} title={<Trans>tree_dashboard_page_title</Trans>}>
      <ChartingForm />
    </Page>
  );
}

export default ChartingContainer;