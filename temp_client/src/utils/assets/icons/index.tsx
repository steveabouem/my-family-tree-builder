import React from 'react';
import { TfiReload, TfiWrite } from "react-icons/tfi";
import { LuImagePlus } from "react-icons/lu";
import { PiTreeStructure, PiBabyFill, PiNewspaperClippingDuotone, PiWarningDuotone, PiArrowsOutLineVerticalLight, PiArrowsInLineVerticalLight } from 'react-icons/pi';
import { IoWoman, IoMan, IoSettings, IoCaretBackOutline, IoImageOutline } from "react-icons/io5";
import { FaCaretDown, FaCaretUp, FaChild, FaChildDress, FaLanguage, FaLink, FaTriangleExclamation, FaUpload, FaUser, FaUsers } from "react-icons/fa6";
import { RiAddCircleLine, RiDeleteBin5Fill, RiArrowUpFill, RiArrowDownFill } from "react-icons/ri";
import { GiEntryDoor, GiExitDoor, GiFamilyTree } from "react-icons/gi";
import { HiColorSwatch } from "react-icons/hi";
import {  CiFileOn, CiSun } from "react-icons/ci";
import { FaSnowman, FaEye } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { LuFlower2 } from "react-icons/lu";
import { Box, Tooltip, useTheme } from '@mui/material';
import { LiaUserSecretSolid } from 'react-icons/lia';
import styled from "styled-components";
import { IconProps } from '../../../types';

export const TreeStructureIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(PiTreeStructure, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const WritingIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(TfiWrite, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const NeedNewImageIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(LuImagePlus, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const MaleIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(IoMan, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FemaleIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(IoWoman, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const BabyIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(PiBabyFill, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const MaleChildIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaChild, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FeMaleChildIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaChildDress, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const SettingsIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(IoSettings, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const DeleteIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(RiDeleteBin5Fill, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const AddIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(RiAddCircleLine, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ThemeSelectIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(HiColorSwatch, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const SunIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(CiSun, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FlowerIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(LuFlower2, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const AutumnIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(TbLeaf, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const SnowmanIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaSnowman, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FamilyTreeIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(GiFamilyTree, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const BackIcon = ({ sx = {}, color = '', size = 30, onClick }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(IoCaretBackOutline, theme);

  return <DynamicIcon style={sx} color={color} size={size} onClick={onClick} />;
};
export const EyeIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaEye, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const GroupIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaUsers, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const EmptyIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(PiNewspaperClippingDuotone , theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const FileIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(CiFileOn, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ImageIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(IoImageOutline, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const LinkIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaLink, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const UploadIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaUpload, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const LogoutIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(GiExitDoor, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const LoginIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(GiEntryDoor, theme);
  
  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const UserIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaUser, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const IncognitoIcon = ({ sx = {}, color = '', size = 17, onClick, link }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(LiaUserSecretSolid, theme);

  return <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ArrowDownIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaCaretDown, theme);

  return tooltip ? (
    <Tooltip title={tooltip || 'what?'}>
      <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ArrowUpIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaCaretUp, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const LanguageIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(FaLanguage, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const WarningIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(PiWarningDuotone, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ReloadIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(TfiReload, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const ExpandIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(RiArrowDownFill, theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};
export const CollapseIcon = ({ sx = {}, color = '', size = 17, onClick, link, tooltip }: IconProps) => {
  const theme = useTheme();

  const DynamicIcon = generateIcon(RiArrowUpFill , theme);

  return tooltip ? (
    <Tooltip title={tooltip}>
      <Box>
        <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />
      </Box>
    </Tooltip>
  ) :
    <DynamicIcon style={{ ...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick} />;
};

const generateIcon = (icon: any, theme: any) => {
  const DynamicIcon = styled(icon)`
    &:hover {
      transition: .4s;
      &:hover {
        color: ${theme.palette.action.hover};
      }
    }
  `;

  return DynamicIcon;
}