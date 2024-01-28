import { DUserDTO } from "../../services/auth/auth.definitions";

export interface DFamilyTree {
  name: string;
  isPublic: boolean;
  members?: DUserDTO[];
}
export interface DTreeManagerFields {
  relation: keyof typeof relationType | '';
  first_name: string;
  last_name: string;
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
    first_name: string;
    last_name: string;
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