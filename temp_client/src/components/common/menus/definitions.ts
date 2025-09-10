import React, { ReactNode } from "react";

export interface BaseMenuProps {
  items: DMenuItem[];
  position: DPositionEnum;
  children?: ReactNode;
}

export interface MenuItem {
  title: string;
  link: string;
  children?: DMenuItem[];
  hasChildren?: boolean;
}

enum DPositionEnum {
  left = 'left',
  right = 'right',
  center = 'center'
}