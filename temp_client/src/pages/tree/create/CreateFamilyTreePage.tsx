import React, { useContext, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import GenealogyContainer from './genealogy';
import GlobalContext from 'contexts/creators/global';
import Page from 'components/common/Page';

const CreateFamilyTreePage = (): JSX.Element => {
  const { loading, toggleLoading } = useContext(GlobalContext);

  useEffect(() => {
    toggleLoading(false);
  }, []);


  return (
    <Page loading={loading} title={<Trans>my_tree_page_title</Trans>} subtitle={<Trans>describe_your_family</Trans>} prevUrl='family-trees'>
      <GenealogyContainer />
    </Page>
  );
}

export default CreateFamilyTreePage;