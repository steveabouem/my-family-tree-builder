import React from 'react';
import { TfiWrite } from "react-icons/tfi";
import { DIconProps } from './definitions';
import { PiTreeStructure } from 'react-icons/pi';


export const TreeStructureIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <PiTreeStructure style={sx} color={color} size={size} />;
};
export const WritingIcon = ({sx = {}, color = '', size = 20}: DIconProps) => {
  return <TfiWrite style={sx} color={color} size={size} />;
};