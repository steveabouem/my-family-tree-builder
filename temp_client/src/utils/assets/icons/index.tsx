import React from 'react';
import { TfiWrite } from "react-icons/tfi";
import { LuImagePlus } from "react-icons/lu";
import { PiTreeStructure, PiBabyFill } from 'react-icons/pi';
import { IoWoman, IoMan, IoSettings, IoCaretBackOutline, IoImageOutline } from "react-icons/io5";
import { FaCaretDown, FaCaretUp, FaChild, FaChildDress, FaDoorOpen, FaLanguage, FaLink, FaUpload, FaUser, FaUsers } from "react-icons/fa6";
import { RiAddCircleLine, RiDeleteBin5Fill } from "react-icons/ri";
import { GiFamilyTree } from "react-icons/gi";
import { HiColorSwatch } from "react-icons/hi";
import { CiCircleList, CiFileOn, CiSun } from "react-icons/ci";
import { FaSnowman, FaEye } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { LuFlower2 } from "react-icons/lu";
import { Box, Tooltip, useTheme } from '@mui/material';
import { LiaUserSecretSolid } from 'react-icons/lia';
// @ts-ignore
import styled from "styled-components";
import { IconProps } from './definitions';

export const TreeStructureIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(PiTreeStructure)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const WritingIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(TfiWrite)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const NeedNewImageIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(LuImagePlus)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const MaleIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(IoMan)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FemaleIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(IoWoman)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const BabyIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(PiBabyFill)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const MaleChildIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaChild)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FeMaleChildIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaChildDress)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const SettingsIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(IoSettings)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const DeleteIcon = ({ sx = {}, color = '', size = 20, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(RiDeleteBin5Fill)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return tooltip?.active ? (
    <Tooltip title={tooltip?.text || ''}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const AddIcon = ({ sx = {}, color = '', size = 20, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(RiAddCircleLine)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return tooltip?.active ? (
    <Tooltip title={tooltip?.text || ''}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ThemeSelectIcon = ({ sx = {}, color = '', size = 20, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(HiColorSwatch)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return tooltip?.active ? (
    <Tooltip title={tooltip?.text || ''}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const SunIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(CiSun)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FlowerIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(LuFlower2)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const AutumnIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(TbLeaf)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const SnowmanIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaSnowman)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FamilyTreeIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(GiFamilyTree)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const BackIcon = ({ sx = {}, color = '', size = 30, onClick }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(IoCaretBackOutline)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={sx} color={color} size={size} onClick={onClick} />;
};
export const EyeIcon = ({ sx = {}, color = '', size = 20, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaEye)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return tooltip?.active ? (
    <Tooltip title={tooltip?.text || ''}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const GroupIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaUsers)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const EmptyIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(CiCircleList)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FileIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(CiFileOn)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ImageIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(IoImageOutline)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const LinkIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaLink)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const UploadIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaUpload)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ExitIcon = ({ sx = {}, color = '', size = 20, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaDoorOpen)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return tooltip?.active ? (
    <Tooltip title={tooltip?.text || ''}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const UserIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaUser)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const IncognitoIcon = ({ sx = {}, color = '', size = 20, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(LiaUserSecretSolid)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ArrowDownIcon = ({ sx = {}, color = '', size = 20, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaCaretDown)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return tooltip?.active ? (
    <Tooltip title={tooltip?.text || 'what?'}>
      <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ArrowUpIcon = ({ sx = {}, color = '', size = 20, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaCaretUp)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return tooltip?.active ? (
    <Tooltip title={tooltip?.text || ''}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const LanguageIcon = ({ sx = {}, color = '', size = 20, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = styled(FaLanguage)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;
  return tooltip?.active ? (
    <Tooltip title={tooltip?.text || ''}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
