import { FamilyMember, User } from "services/api.definitions";

export interface FamilyTree {
  id: number;
  name: string;
  public: boolean;
  dob: string,
  members?: User[];
  authorized_ips: string;
  active: boolean;
}
export interface TreeManagerFields {
  relation: keyof typeof relationType | '';
  firstName: string;
  lastName: string;
  id?: number; // FTTreeNode
  siblings?: string[];
  user_id?: number;
  marital_status: string;
}

export interface TreeManagerProps {
  numberOfSiblings: number;
  hasSpouse: boolean;
}

export interface Sibling {
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

interface ParentDetails {
  id: string;
  gender: 'male' | 'female';
}

interface SiblingsDetails {
  id: string;
  type: 'blood' | 'union';
}

interface SpouseDetails {
  id: string;
  type: 'married' | 'divorced';
}

export interface TreeNode {
  id: string;
  hasSubTree?: boolean;
  gender: 'male' | 'female';
  firstName: string;
  lastName: string;
  age: number;
  description?: string;
  marital_status?: string;
  profile_url?: string;
  parents: Partial<FamilyMember>;
  siblings:Partial<FamilyMember>;
  spouses: Partial<FamilyMember>;
  children:Partial<FamilyMember>;
}

export interface NodeInfo {
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
export type ReactFlowNode = Partial<FamilyMember> & {
    type: string;
    position: {x: number, y: number},
    children: string;
    spouses: string;
    data: Partial<FamilyMember>;
}
export interface ReactFlowEdge {
  id: string;
  position: { x: number, y: number };
  data: { label: string };
}

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