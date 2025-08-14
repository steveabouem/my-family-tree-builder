import React, { memo, useMemo, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Trans } from '@lingui/macro';
import Initials from 'components/common/Initials';
import { Gendersenum } from 'components/common/definitions';
import { BabyIcon, FeMaleChildIcon, FemaleIcon, MaleChildIcon, MaleIcon } from 'utils/assets/icons';

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
    <Box
      width={showDetails ? '250px' : '70px'} height={showDetails ? '120px' : '40px'} padding={1}
      onMouseEnter={() => { setShowDetails(true) }} onMouseLeave={() => { setShowDetails(false) }}
      display="flex" border=".6px solid #8e6c75" borderRadius={2} flexDirection="column"
      gap={1} justifyContent="start" alignItems="center" bgcolor={getNodeBG()}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        {
          !!data.profile_url?.length ? <img src={data.profile_url} /> :
            <Initials firstName={data.first_name} lastName={data.last_name} bg={getInitialsBG()} />
        }
        {/* <Handle
        type="source"
          id='top'
          position={Position.Top}
          style={{ background: '#555' }}
          isConnectable={true}
        /> */}
        <Box display="flex" gap={1} alignItems="center">
          {renderNodeIcon()}
          {/* <Button size='small' sx={{ minWidth: '15px' }} >
            <SettingsIcon color="#5d576b" size={15} />
          </Button>
          <Button size='small' sx={{ minWidth: '15px' }}>
            <DeleteIcon color="#5d576b" size={15} />
          </Button> */}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" width="100%" overflow="hidden scroll" position="relative">
        <Box display="flex" justifyContent="space-between" alignItems="center">
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
    </Box>
  );
});