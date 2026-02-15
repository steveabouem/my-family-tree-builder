import React, { memo, useState } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
// @ts-ignore
import styled from 'styled-components';
import Initials from 'components/common/Initials';
import { Gendersenum } from 'types';
import { BabyIcon, DeleteIcon, FeMaleChildIcon, FemaleIcon, MaleChildIcon, MaleIcon } from 'utils/assets/icons';

// TODO: check types in reacflow docs and create validations for node and edge structures. if any prop doesnt match the type, there can be undetected errors
// anchor doesnt have the ability to be dragged for some reason, because position is empty
export default memo(({ data }: any) => {
  const [showDetails, setShowDetails] = useState(true);
  const theme = useTheme();

  function getInitialsBG() {
    return data.gender === Gendersenum.female ? theme.palette.info.contrastText : theme.palette.info.main;
  }
  function getNodeBG() {
    return !data.dod?.length ? theme.palette.info.main : '#737373';
  }
  function renderNodeIcon() {
    const isAdult = data.age > 15;
    const isBaby = data.age <= 3;
    const isInfant = data.age > 3 && data.age <= 15;

    if (isAdult) {
      return data.gender === Gendersenum.female ? <FemaleIcon color="#5d576b" size={20} /> : <MaleIcon color="#5d576b" size={20} />;
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
    <MainContainer expand={showDetails} bg={getNodeBG()}>
      <Box sx={headerContainerStyle}>
        {
          !!data.profile_url?.length ? <MemberThumbnail src={data.profile_url} /> :
            <Initials firstName={data.first_name} lastName={data.last_name} bg={getInitialsBG()} />
        }
        {/* <Handle
        type="source"
          id='top'
          position={Position.Top}
          style={{ background: '#555' }}
          isConnectable={true}
        /> */}
        <Box sx={iconContainerStyle}>
          {renderNodeIcon()}
          {/* <Button size='small' sx={{ minWidth: '15px' }} >
            <SettingsIcon color="#5d576b" size={15} />
          </Button>
          <Button size='small' sx={{ minWidth: '15px' }}>
            <DeleteIcon color="#5d576b" size={15} />
          </Button> */}
        </Box>
      </Box>
      <Box sx={contentContainerStyle}>
        <Box sx={nameAgeContainerStyle}>
          <Typography variant='body1'>{data.first_name} {data.last_name}</Typography>
          <Typography variant='body2'>
            {data.age} <Trans>years_old</Trans>
          </Typography>
        </Box>
        <Typography variant='body1'>
          {data.occupation}
        </Typography>
      </Box>
      {/* <Handle
      type="target"
        id={data.node_id + 'bottom'}
        position={Position.Bottom}
        style={{ background: '#555' }}
        isConnectable={true}
      /> */}
    </MainContainer>
  );
});

const MainContainer = styled(Box)<{bg: string, expand: boolean}>`
  padding: 1;
  display: flex;
  border: .6px solid #8e6c75;
  border-radius: 5px;
  flex-direction: column;
  gap: 1;
  justify-content: start;
  align-items: center;
  width: ${(props: any) => props.expand ? '250px' : '70px'};
  height: ${(props: any) => props.expand ? '120px' : '40px'};
  background-color: ${(props: any) => props.bg};
`; 
const headerContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const iconContainerStyle = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
};

const contentContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden scroll',
  position: 'relative',
};

const nameAgeContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const MemberThumbnail = styled.img`
  height: 40px;
  border-radius: 80px;
  width: 40px;
`;