import React from 'react';
import { TfiWrite } from "react-icons/tfi";
import { LuImagePlus } from "react-icons/lu";
import { DIconProps } from './definitions';
import { PiTreeStructure, PiBabyDuotone  } from 'react-icons/pi';
import { IoWomanOutline, IoManOutline  } from "react-icons/io5";
import { FaChild, FaChildDress  } from "react-icons/fa6";



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
  return <IoManOutline style={sx} color={color} size={size} />;
};
export const  FemaleIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <IoWomanOutline style={sx} color={color} size={size} />;
};
export const  BabyIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <PiBabyDuotone style={sx} color={color} size={size} />;
};
export const  MaleChildIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <FaChild style={sx} color={color} size={size} />;
};
export const  FeMaleChildIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <FaChildDress style={sx} color={color} size={size} />;
};
