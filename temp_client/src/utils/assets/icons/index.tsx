import React from 'react';
import { TfiWrite } from "react-icons/tfi";
import { LuAlbum, LuArmchair, LuBaggageClaim, LuImagePlus } from "react-icons/lu";
import { PiTreeStructure, PiBabyFill, PiListMagnifyingGlassDuotone, PiAppWindow  } from 'react-icons/pi';
import { IoWoman, IoMan, IoSettings, IoCaretBackOutline, IoTrash, IoArchiveOutline, IoImageOutline, IoLogOut  } from "react-icons/io5";
import { FaCaretDown, FaCaretUp, FaChild, FaChildDress, FaDoorOpen, FaLink, FaUpload, FaUser, FaUsers  } from "react-icons/fa6";
import { RiAddCircleLine, RiAddFill, RiDeleteBin5Fill } from "react-icons/ri";
import { GiFamilyTree } from "react-icons/gi";
import { HiColorSwatch } from "react-icons/hi";
import { CiCircleList, CiFileOn, CiSun } from "react-icons/ci";
import { FaSnowman, FaEye, FaApper } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { LuFlower2 } from "react-icons/lu";
import { IconProps } from './definitions';
import { LiaDoorClosedSolid, LiaHamburgerSolid, LiaUserSecretSolid } from 'react-icons/lia';

export const TreeStructureIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <PiTreeStructure style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const WritingIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <TfiWrite style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  NeedNewImageIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <LuImagePlus style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  MaleIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <IoMan style={{...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick}/>;
};
export const  FemaleIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <IoWoman style={{...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick}/>;
};
export const  BabyIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <PiBabyFill style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  MaleChildIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaChild style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  FeMaleChildIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaChildDress style={{...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick}/>;
};
export const  SettingsIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <IoSettings style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  DeleteIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <RiDeleteBin5Fill style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  AddIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <RiAddCircleLine style={{...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick}/>;
};
export const  ThemeSelectIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <HiColorSwatch style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  SunIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <CiSun style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  FlowerIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <LuFlower2 style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  AutumnIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <TbLeaf style={{...sx, cursor: link ? 'pointer' : 'auto' }} color={color} size={size} onClick={onClick}/>;
};
export const  SnowmanIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaSnowman style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  FamilyTreeIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <GiFamilyTree style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick}/>;
};
export const  BackIcon = ({sx = {}, color = '', size = 30, onClick}: IconProps) => {
  return <IoCaretBackOutline style={sx} color={color} size={size} onClick={onClick} />;
};
export const  EyeIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaEye style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  GroupIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaUsers style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  EmptyIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <CiCircleList style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  FileIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <CiFileOn style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  ImageIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <IoImageOutline style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  LinkIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaLink style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  UploadIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaUpload style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  ExitIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaDoorOpen style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  UserIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaUser style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  IncognitoIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <LiaUserSecretSolid style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  ArrowDownIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaCaretDown style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
export const  ArrowUpIcon = ({sx = {}, color = '', size = 20, onClick, link}: IconProps) => {
  return <FaCaretUp style={{...sx, cursor: link ? 'pointer' : 'auto'}} color={color} size={size} onClick={onClick} />;
};
