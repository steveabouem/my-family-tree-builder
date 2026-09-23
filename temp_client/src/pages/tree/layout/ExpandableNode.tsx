import { Collapse, MenuItem, Typography, useTheme } from '@mui/material';
import { NodeProps } from '@xyflow/react';
import styled from 'styled-components';
import BoxRow from 'components/common/containers/column';
import Initials from 'components/common/Initials';
import { memberInitialsHeight, treeNodeHeight, treeNodeWidth } from 'pages/constants';
import { DropdownOption, ExpandableNodeProps, Gender, KinshipType } from 'types';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { AddIcon, RemoveIcon } from 'utils/assets/icons';

const relativeOptions: DropdownOption[] = [
  { label: <Trans>add parent</Trans>, value: KinshipType.parent },
  { label: <Trans>add sibling</Trans>, value: KinshipType.sibling },
  { label: <Trans>add spouse</Trans>, value: KinshipType.spouse },
  { label: <Trans>add child</Trans>, value: KinshipType.child },
];

const ExpandableNode = ({ data, draggable = true }: NodeProps<ExpandableNodeProps>) => {
  const [exp, setExp] = useState(false);
  const theme = useTheme();

  function getInitialsBG() {
    return data?.member?.gender === Gender.Female ? theme.palette.info.contrastText : theme.palette.info.main;
  }

  return (
    <>
      <MemberFrame sx={{
        height: treeNodeHeight, width: treeNodeWidth, maxWidth: treeNodeWidth,
        padding: '1rem', alignItems: 'center', justifyContent: 'space-between',
        background: theme.palette.background.paper,
        // border: data?.selected ? `1px solid hsl(from ${theme.palette.info.main} h s l / 0.5)` : '1px solid',
      }} onClick={data?.onClick}>
        {
          !!data?.member?.profile_url?.length ? <MemberThumbnail src={data?.member?.profile_url} /> :
            <Initials firstName={data?.member?.first_name || ''} lastName={data?.member?.last_name || ''} bg={getInitialsBG()} />
        }
        <MemberName variant='body1' color={data?.selected ? theme.palette.primary.main : theme.palette.info.main} sx={{
          backgroundColor: data?.selected ? theme.palette.info.main : `hsl(from ${theme.palette.primary.main} h s l / 0.5)`
        }} >{data?.member?.first_name} {data?.member?.last_name}</MemberName>

        {exp ? <RemoveIcon onClick={() => setExp(!exp)} /> : <AddIcon onClick={() => setExp(!exp)} />}
      </MemberFrame>
      <Collapse in={exp} timeout="auto" unmountOnExit orientation='vertical' sx={{background: '#1b132291'}}>
        {relativeOptions.map((r, i) => (
          <MenuItem
            sx={{ justifyContent: 'end' }} key={`relative-${i}`}
            onClick={() => { data.addRelative(r.value as KinshipType); setExp(false); }}
          >{r.label}</MenuItem>)
        )}
      </Collapse>
    </>
  );
};

const MemberFrame = styled(BoxRow) <{ theme: any, highlighted?: boolean }>`
  transition: .4s ease;
`;
const MemberName = styled(Typography)`
  transition: .4s ease;
  margin: 1em;
  padding: .2rem;
  padding: .2rem;
  border-radius: 5px;
  height: ${memberInitialsHeight}
`;
const MemberThumbnail = styled.img`
  height: ${memberInitialsHeight};
  border-radius: 60px;
  width: ${memberInitialsHeight};
`;

export default ExpandableNode;