import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Button, Typography } from '@mui/material';
import { Trans } from '@lingui/macro';
import Initials from 'components/common/Initials';
import { Gendersenum } from 'components/common/definitions';
import { BabyIcon, DeleteIcon, FeMaleChildIcon, FemaleIcon, MaleChildIcon, MaleIcon, SettingsIcon, WritingIcon } from 'utils/assets/icons';

export default memo(({ data }: any) => {

  function getInitialsBG() {
    return data?.gender === Gendersenum.female ? '#f4ceff' : '#f2efff';
  }
  function renderNodeIcon() {
    const isAdult = data?.age > 15;
    const isBaby = data?.age <= 3;
    const isInfant = data?.age > 3 && data?.age <= 15;

    if (isAdult) {
      return data?.gender === Gendersenum.female ? <FemaleIcon color="#5d576b" size={20} /> : <MaleIcon color="#5d576b" size={20} />;
    }
    if (isBaby) {
      return <BabyIcon color="#5d576b" size={20} />;
    }
    if (isInfant) {
      return data?.gender === Gendersenum.female ? <FeMaleChildIcon color="#5d576b" size={20} /> : <MaleChildIcon color="#5d576b" size={20} />;
    }

    return <MaleIcon />;
  }

  return (
    <Box
      width="250px" height="90px" padding={1} display="flex"
      flexDirection="column" gap={1} justifyContent="start" alignItems="center" bgcolor="#fff8ef"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        {
          !!data?.profile_url?.length ? <img src={data.profile_url} /> :
            <Initials firstName={data.first_name} lastName={data.last_name} bg={getInitialsBG()} />
        }
        {/* <Handle
          type="target"
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
          <Typography variant='caption'>{data.first_name} {data.last_name}</Typography>
          <Typography variant='caption'>
            {data.age} <Trans>years_old</Trans>
          </Typography>
        </Box>
        <Typography variant='caption'>
          {data.occupation}
        </Typography>
      </Box>
    </Box>
  );
});