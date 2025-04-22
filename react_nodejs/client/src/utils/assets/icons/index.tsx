import React from 'react';
import { TfiWrite } from "react-icons/tfi";
import { LuImagePlus } from "react-icons/lu";
import { PiTreeStructure, PiBabyFill  } from 'react-icons/pi';
import { IoWoman, IoMan, IoSettings  } from "react-icons/io5";
import { FaChild, FaChildDress  } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { DIconProps } from './definitions';
import { GiFamilyTree } from "react-icons/gi";

export const TreeStructureIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <PiTreeStructure style={sx} color={color} size={size} />;
};
export const WritingIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <TfiWrite style={sx} color={color} size={size} />;
};
export const  NeedNewImageIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <LuImagePlus style={sx} color={color} size={size} />;
};
export const  MaleIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <IoMan style={sx} color={color} size={size} />;
};
export const  FemaleIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <IoWoman style={sx} color={color} size={size} />;
};
export const  BabyIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <PiBabyFill style={sx} color={color} size={size} />;
};
export const  MaleChildIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <FaChild style={sx} color={color} size={size} />;
};
export const  FeMaleChildIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <FaChildDress style={sx} color={color} size={size} />;
};
export const  SettingsIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <IoSettings style={sx} color={color} size={size} />;
};
export const  DeleteIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <RiDeleteBin5Fill style={sx} color={color} size={size} />;
};
export const  FamilyTreeIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <GiFamilyTree style={sx} color={color} size={size} />;
};
