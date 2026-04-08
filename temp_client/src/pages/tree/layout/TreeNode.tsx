import React, { memo } from 'react';
import { Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import Initials from 'components/common/Initials';
import { BabyIcon, FeMaleChildIcon, FemaleIcon, MaleChildIcon, MaleIcon } from 'utils/assets/icons';
import BoxColumn from 'components/common/containers/row/BoxColumn';
import { Gender } from 'types';
import { Background, Handle, Position } from '@xyflow/react';

// TODO: check types in reacflow docs and create validations for node and edge structures. if any prop doesnt match the type, there can be undetected errors
const TreeNode = memo(({ data }: any) => {
  const theme = useTheme();

  function getInitialsBG() {
    return data.gender === Gender.Female ? theme.palette.info.contrastText : theme.palette.info.main;
  }
  function renderNodeIcon() {
    const isAdult = data.age > 15;
    const isBaby = data.age <= 3;
    const isInfant = data.age > 3 && data.age <= 15;

    if (isAdult) {
      return data.gender === Gender.Female ? <FemaleIcon color={theme.palette.action.hover} size={20} /> : <MaleIcon color={theme.palette.action.hover} size={20} />;
    }
    if (isBaby) {
      return <BabyIcon color="#5d576b" size={20} />;
    }
    if (isInfant) {
      return data.gender === Gender.Female ? <FeMaleChildIcon color="#5d576b" size={20} /> : <MaleChildIcon color="#5d576b" size={20} />;
    }

    return <MaleIcon />;
  }

  return (
    <>
      <Handle
        type="source"
        id={`${data.id}-source`}
        position={Position.Bottom}
        style={{ background: 'transparent' }}
        isConnectable={true}
      />
      <BoxColumn sx={{ alignItems: 'center', background: theme.palette.background.default, padding: '.5rem' }}>
        {
          !!data.profile_url?.length ? <MemberThumbnail src={data.profile_url} /> :
            <Initials firstName={data.first_name} lastName={data.last_name} bg={getInitialsBG()} />
        }
        <MemberName variant='body1' color={theme.palette.primary.dark} sx={{
          backgroundColor: `hsl(from ${theme.palette.info.contrastText} h s l / 0.5)`
        }} >{data.first_name} {data.last_name}</MemberName>
      </BoxColumn>
      <Handle
        type="target"
        id={`${data.id}-target`}
        position={Position.Bottom}
        style={{ background: 'transparent' }}
        isConnectable={true}
      />
    </>
  );
});

const MemberName = styled(Typography)`
  margin: 0;
  padding: .2rem;
  padding: .2rem;
  border-radius: 5px;
`;
const MemberThumbnail = styled.img`
  height: 30px;
  border-radius: 60px;
  width: 30px;
`;

export default TreeNode;