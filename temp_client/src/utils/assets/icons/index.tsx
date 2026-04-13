import React from 'react';
import { TfiReload, TfiWrite } from "react-icons/tfi";
import { LuImagePlus, LuSun } from "react-icons/lu";
import { PiTreeStructure, PiBabyFill, PiNewspaperClippingDuotone, PiWarningDuotone, PiArrowsOutLineVerticalLight, PiArrowsInLineVerticalLight } from 'react-icons/pi';
import { IoWoman, IoMan, IoSettings, IoCaretBackOutline, IoImageOutline } from "react-icons/io5";
import { FaCaretDown, FaCaretUp, FaChild, FaChildDress, FaLanguage, FaLink, FaTriangleExclamation, FaUpload, FaUser, FaUsers } from "react-icons/fa6";
import { RiAddCircleLine, RiDeleteBin5Fill, RiArrowUpFill, RiArrowDownFill, RiMoonClearFill } from "react-icons/ri";
import { GiEntryDoor, GiExitDoor, GiFamilyTree } from "react-icons/gi";
import { HiColorSwatch } from "react-icons/hi";
import { CiFileOn, CiSun } from "react-icons/ci";
import { FaSnowman, FaEye } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { LuFlower2 } from "react-icons/lu";
import { Box, Tooltip, useTheme } from '@mui/material';
import { LiaUserSecretSolid } from 'react-icons/lia';
import styled from "styled-components";
import { IconProps } from '../../../types';

export const TreeStructureIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledPiTreeStructure theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledPiTreeStructure = styled(PiTreeStructure) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;
export const WritingIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();


  return <StyledTfiWrite theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledTfiWrite = styled(TfiWrite) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const NeedNewImageIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledLuImagePlus theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledLuImagePlus = styled(LuImagePlus) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const MaleIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledIoMan theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledIoMan = styled(IoMan) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const FemaleIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledIoWoman theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledIoWoman = styled(IoWoman) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const BabyIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledPiBabyFill theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledPiBabyFill = styled(PiBabyFill) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const MaleChildIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledFaChild theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaChild = styled(FaChild) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const FeMaleChildIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledFaChildDress theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaChildDress = styled(FaChildDress) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const SettingsIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledIoSettings theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledIoSettings = styled(IoSettings) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const DeleteIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();


  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledRiDeleteBin5Fill theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledRiDeleteBin5Fill theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledRiDeleteBin5Fill = styled(RiDeleteBin5Fill) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const AddIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledRiAddCircleLine theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledRiAddCircleLine theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledRiAddCircleLine = styled(RiAddCircleLine) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const ThemeSelectIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledHiColorSwatch theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledHiColorSwatch theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledHiColorSwatch = styled(HiColorSwatch) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const LightIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledSun theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledSun theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledSun = styled(LuSun) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const DarkIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledMoon theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledMoon theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledMoon = styled(RiMoonClearFill) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const SunIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledCiSun theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledCiSun = styled(CiSun) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const FlowerIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledLuFlower2 theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledLuFlower2 = styled(LuFlower2) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const AutumnIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledTbLeaf theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledTbLeaf = styled(TbLeaf) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const SnowmanIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledFaSnowman theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaSnowman = styled(FaSnowman) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const FamilyTreeIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledGiFamilyTree theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledGiFamilyTree = styled(GiFamilyTree) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const BackIcon = ({ sx = {}, color = '', size = 30, onClick }: IconProps) => {
  const theme = useTheme();

  return <StyledIoCaretBackOutline style={sx} color={color} size={size} onClick={onClick} />;
};
const StyledIoCaretBackOutline = styled(IoCaretBackOutline) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const EyeIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();


  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledFaEye theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledFaEye theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaEye = styled(FaEye) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const GroupIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledFaUsers theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaUsers = styled(FaUsers) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const EmptyIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledPiNewspaperClippingDuotone theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledPiNewspaperClippingDuotone = styled(PiNewspaperClippingDuotone) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const FileIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledCiFileOn theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledCiFileOn = styled(CiFileOn) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const ImageIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledIoImageOutline theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledIoImageOutline = styled(IoImageOutline) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const LinkIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledFaLink theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaLink = styled(FaLink) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const UploadIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledFaUpload theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaUpload = styled(FaUpload) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const LogoutIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledGiExitDoor theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledGiExitDoor theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledGiExitDoor = styled(GiExitDoor) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const LoginIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledGiEntryDoor theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledGiEntryDoor theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledGiEntryDoor = styled(GiEntryDoor) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const UserIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledFaUser theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaUser = styled(FaUser) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const IncognitoIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  return <StyledLiaUserSecretSolid theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledLiaUserSecretSolid = styled(LiaUserSecretSolid) <{ theme: any }>`
  transition: .4s;
  &:hover {
    color: ${(props: any) => props.theme.palette.action.hover};
  }
`;

export const ArrowDownIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip || 'what?'}>
      <StyledFaCaretDown theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
    </Tooltip>
  ) :
    <StyledFaCaretDown theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaCaretDown = styled(FaCaretDown) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const ArrowUpIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledFaCaretUp theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledFaCaretUp theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledFaCaretUp = styled(FaCaretUp) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const LanguageIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledFaLanguage theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledFaLanguage theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};

const StyledFaLanguage = styled(FaLanguage) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const WarningIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledPiWarningDuotone theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledPiWarningDuotone theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledPiWarningDuotone = styled(PiWarningDuotone) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const ReloadIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledTfiReload theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledTfiReload theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledTfiReload = styled(TfiReload) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const ExpandIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledRiArrowDownFill theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledRiArrowDownFill theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledRiArrowDownFill = styled(RiArrowDownFill) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;

export const CollapseIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <StyledRiArrowUpFill theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <StyledRiArrowUpFill theme={theme} style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
const StyledRiArrowUpFill = styled(RiArrowUpFill) <{ theme: any }>`
    transition: .4s;
    &:hover {
      color: ${(props: any) => props.theme.palette.action.hover};
    }
`;