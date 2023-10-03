import React, { ReactNode } from "react";

export interface DBaseMenuProps {
  items: DMenuItem[];
  position: DPositionEnum;
  children?: ReactNode;
}

export interface DMenuItem {
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