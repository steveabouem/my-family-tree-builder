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
import { DIconProps } from './definitions';

export const TreeStructureIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <PiTreeStructure style={sx} color={color} size={size} onClick={onClick}/>;
};
export const WritingIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <TfiWrite style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  NeedNewImageIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <LuImagePlus style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  MaleIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <IoMan style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  FemaleIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <IoWoman style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  BabyIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <PiBabyFill style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  MaleChildIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <FaChild style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  FeMaleChildIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <FaChildDress style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  SettingsIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <IoSettings style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  DeleteIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <RiDeleteBin5Fill style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  ThemeSelectIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <HiColorSwatch style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  SunIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <CiSun style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  FlowerIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <LuFlower2 style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  AutumnIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <TbLeaf style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  SnowmanIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <FaSnowman style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  FamilyTreeIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <GiFamilyTree style={sx} color={color} size={size} onClick={onClick}/>;
};
export const  BackIcon = ({sx = {}, color = '', size = 30, onClick}: DIconProps) => {
  return <IoCaretBackOutline style={sx} color={color} size={size} onClick={onClick} />;
};
export const  EyeIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <FaEye style={sx} color={color} size={size} onClick={onClick} />;
};
export const  GroupIcon = ({sx = {}, color = '', size = 20, onClick}: DIconProps) => {
  return <FaUsers style={sx} color={color} size={size} onClick={onClick} />;
};
