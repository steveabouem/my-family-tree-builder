import React, { memo } from 'react';
import { Typography, useTheme } from '@mui/material';
import styled from 'styled-components';
import Initials from 'components/common/Initials';
import { Gendersenum } from 'types';
import { BabyIcon, FeMaleChildIcon, FemaleIcon, MaleChildIcon, MaleIcon } from 'utils/assets/icons';
import BoxColumn from 'components/common/containers/row/BoxColumn';

// TODO: check types in reacflow docs and create validations for node and edge structures. if any prop doesnt match the type, there can be undetected errors
export default memo(({ data }: any) => {
  const theme = useTheme();

  function getInitialsBG() {
    return data.gender === Gendersenum.female ? theme.palette.info.contrastText : theme.palette.info.main;
  }
  function renderNodeIcon() {
    const isAdult = data.age > 15;
    const isBaby = data.age <= 3;
    const isInfant = data.age > 3 && data.age <= 15;

    if (isAdult) {
      return data.gender === Gendersenum.female ? <FemaleIcon color={theme.palette.action.hover} size={20} /> : <MaleIcon color={theme.palette.action.hover} size={20} />;
    }
    if (isBaby) {
      return <BabyIcon color="#5d576b" size={20} />;
    }
    if (isInfant) {
      return data.gender === Gendersenum.female ? <FeMaleChildIcon color="#5d576b" size={20} /> : <MaleChildIcon color="#5d576b" size={20} />;
    }

    return <MaleIcon />;
  }

  return (
    <BoxColumn sx={{ alignItems: 'center' }}>
      {renderNodeIcon()}
      {
        !!data.profile_url?.length ? <MemberThumbnail src={data.profile_url} /> :
          <Initials firstName={data.first_name} lastName={data.last_name} bg={getInitialsBG()} />
      }
        <Typography variant='body1' color={theme.palette.primary.dark} sx={{background: theme.palette.info.main, padding: '.2rem', borderRadius: '5px'}}>{data.first_name} {data.last_name}</Typography>
      {/* <Handle
        type="source"
          id='top'
          position={Position.Top}
          style={{ background: '#555' }}
          isConnectable={true}
        /> */}
        {/* <Button size='small' sx={{ minWidth: '15px' }} >
            <SettingsIcon color="#5d576b" size={15} />
          </Button>
          <Button size='small' sx={{ minWidth: '15px' }}>
            <DeleteIcon color="#5d576b" size={15} />
          </Button> */}
    </BoxColumn>
  );
});

const MemberThumbnail = styled.img`
  height: 40px;
  border-radius: 80px;
  width: 40px;
`;