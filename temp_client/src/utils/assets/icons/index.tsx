import React from 'react';
import { TfiWrite } from "react-icons/tfi";
import { LuImagePlus } from "react-icons/lu";
import { PiTreeStructure, PiBabyFill  } from 'react-icons/pi';
import { IoWoman, IoMan, IoSettings, IoCaretBackOutline  } from "react-icons/io5";
import { FaChild, FaChildDress, FaUsers  } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { GiFamilyTree } from "react-icons/gi";
import { HiColorSwatch } from "react-icons/hi";
import { CiSun } from "react-icons/ci";
import { FaSnowman, FaEye } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { LuFlower2 } from "react-icons/lu";
import { IconProps } from './definitions';

export const TreeStructureIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <PiTreeStructure style={sx} color={color} size={size} onClick={onClick}/>;
};
export const WritingIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <TfiWrite style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  NeedNewImageIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <LuImagePlus style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  MaleIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <IoMan style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  FemaleIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <IoWoman style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  BabyIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <PiBabyFill style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  MaleChildIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <FaChild style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  FeMaleChildIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <FaChildDress style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  SettingsIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <IoSettings style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  DeleteIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <RiDeleteBin5Fill style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  ThemeSelectIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <HiColorSwatch style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  SunIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <CiSun style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  FlowerIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <LuFlower2 style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  AutumnIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <TbLeaf style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  SnowmanIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <FaSnowman style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  FamilyTreeIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <GiFamilyTree style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  BackIcon = ({sx = {}, color = '', size = 30, onClick}: IconProps) => {
  return <IoCaretBackOutline style={sx} color={color} size={size} onClick={onClick} />;
};
export const  EyeIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <FaEye style={sx} color={color} size={size} onClick={onClick} />;
};
export const  GroupIcon = ({sx = {}, color = '', size = 20, onClick}: IconProps) => {
  return <FaUsers style={sx} color={color} size={size} onClick={onClick} />;
};
