import React, { memo } from 'react';
import { Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import Initials from 'components/common/Initials';
import { Gender, TreeNodeProps } from 'types';
import {  Handle, Position } from '@xyflow/react';
import BoxRow from 'components/common/containers/column';
import { memberInitialsHeight, treeNodeHeight, treeNodeWidth } from '../../constants';

const TreeNode = memo(({ data }: TreeNodeProps) => {
  const theme = useTheme();

  function getInitialsBG() {
    return data.gender === Gender.Female ? theme.palette.info.contrastText : theme.palette.info.main;
  }
  // function renderNodeIcon() {
  //   const isAdult = data.age > 15;
  //   const isBaby = data.age <= 3;
  //   const isInfant = data.age > 3 && data.age <= 15;

  //   if (isAdult) {
  //     return data.gender === Gender.Female ? <FemaleIcon color={theme.palette.action.hover} size={20} /> : <MaleIcon color={theme.palette.action.hover} size={20} />;
  //   }
  //   if (isBaby) {
  //     return <BabyIcon color="#5d576b" size={20} />;
  //   }
  //   if (isInfant) {
  //     return data.gender === Gender.Female ? <FeMaleChildIcon color="#5d576b" size={20} /> : <MaleChildIcon color="#5d576b" size={20} />;
  //   }

  //   return <MaleIcon />;
  // }

  return (
    <>
      <Handle
        type="source"
        id={`${data.id}-source`}
        position={Position.Top}
        style={{ background: 'transparent' }}
        isConnectable={true}
      />
      <MemberFrame sx={{height: treeNodeHeight, width: treeNodeWidth, maxWidth: treeNodeWidth, alignItems: 'center', background: theme.palette.background.paper, border:  data?.highlighted ?  `1px solid hsl(from ${ theme.palette.info.main} h s l / 0.5)` : 'none', padding: '.5rem' }} onClick={data?.onClick}>
        {
          !!data.profile_url?.length ? <MemberThumbnail src={data.profile_url} /> :
            <Initials firstName={data.first_name} lastName={data.last_name} bg={getInitialsBG()} />
        }
        <MemberName variant='body1' color={data?.selected ? theme.palette.primary.main : theme.palette.info.main} sx={{
          backgroundColor: data?.selected ? theme.palette.info.main : `hsl(from ${theme.palette.primary.main} h s l / 0.5)`
        }} >{data.first_name} {data.last_name}</MemberName>
      </MemberFrame>
      <Handle
        type="target"
        id={`${data.id}-target`}
        position={Position.Top}
        style={{ background: 'transparent' }}
        isConnectable={true}
      />
    </>
  );
});

const MemberFrame = styled(BoxRow) <{ theme: any, highlighted?: boolean }>`
  transition: .4s ease;
`;

const MemberName = styled(Typography)`
  transition: .4s ease;
  margin: 0;
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

export default TreeNode;