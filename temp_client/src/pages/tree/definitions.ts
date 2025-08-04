import { DUserDTO } from "services/api.definitions";

export interface DFamilyTree {
  id: number;
  name: string;
  public: boolean;
  dob: string,
  members?: DUserDTO[];
  authorized_ips: string;
  active: boolean;
}
export interface DTreeManagerFields {
  relation: keyof typeof relationType | '';
  firstName: string;
  lastName: string;
  id?: number; // FTTreeNode
  siblings?: string[];
  user_id?: number;
  marital_status: string;
}

export interface DTreeManagerProps {
  numberOfSiblings: number;
  hasSpouse: boolean;
}

export interface DSibling {
  firstName: string;
  lastName: string;
  age: string;
  occupation: string;
  partner?: string; // User
  marital_status: string;
  is_parent: number;
  description: string;
  gender: string; // 1:m 2:f
  profile_url: string;
  user_id?: number;
  email: string;
  relation: string; // value of relation type below
}

/* REACT_FAMILY_TREE package */
interface DParentDetails {
  id: string;
  gender: 'male' | 'female';
}

interface DSiblingsDetails {
  id: string;
  type: 'blood' | 'union';
}

interface DSpouseDetails {
  id: string;
  type: 'married' | 'divorced';
}

export interface DTreeNode {
  id: string;
  hasSubTree?: boolean;
  gender: 'male' | 'female';
  firstName: string;
  lastName: string;
  age: number;
  description?: string;
  marital_status?: string;
  profile_url?: string;
  parents: DParentDetails[];
  siblings: DSiblingsDetails[];
  spouses: DSpouseDetails[];
  children: DSiblingsDetails[];
}

/*
* React flow
*/
export interface DNodeInfo {
  label: string;
  id: number;
  dob: string;
  dod?: string;
  node_id: string;
  email: string;
  firstName: string;
  gender: number;
  lastName: string;
  marital_status: string;
  occupation: string;
  parents: string;
  siblings: string;
  spouses: string;
  children: string;
  age: number;
  description: string;
  profile_url: string;
  user_id: number;
  created_by: number;
}
export type DReactFlowNode = DNodeInfo & {
    type: string;
    position: {x: number, y: number},
    children: string;
    spouses: string;
    data: DNodeInfo;
}
export interface DReactFlowEdge {
  id: string;
  position: { x: number, y: number };
  data: { label: string };
}
/* END */

export const relationType = {
  a: 'aunt',
  b: 'brother',
  f: 'father',
  gd: 'grand-father',
  gm: 'grand-mother',
  h: 'husband',
  m: 'mother',
  s: 'sister',
  u: 'uncle',
  w: 'wife',
} as const;

export const relationTypeCode = {
  a: 'a',
  b: 'b',
  f: 'f',
  gd: 'gd',
  gm: 'gm',
  h: 'h',
  m: 'm',
  s: 's',
  u: 'u',
  w: 'w',
} as const;

export enum NodeMenuActions {
  edit = 'edit_node',
  add = 'add_node_relative',
  delete = 'delete',
};