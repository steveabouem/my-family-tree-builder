import { NodeTypes } from "@xyflow/react";
import { HttpStatusCode } from "axios";
/*
* Holds declarations for all the API types, notably DTOs/DAOS
*/
interface DApiResponseRoot {
  error: boolean;
  code: number;
  sessionId?: string;
  message?: string;
}
export type DApiResponse<B> = DApiResponseRoot & B;
// #region user
export interface DUserRelatedFamily {
  id: number;
  name: string;
}
// #region auth
export interface DUserDTO {
  userId?: number;
  first_name: string;
  last_name: string;
  age: number;
  occupation: string;
  partner?: number;
  marital_status: string;
  password: string;
  email: string;
  is_parent: number;
  has_ipa?: number;
  gender: number; // 1: M; 2:F
  assigned_ips: string[];
  profile_url: string;
  description: string;
  imm_family: number;
  related_to: number[];
  sessionToken?: string;
}

export interface DUserSession {
  authenticated: boolean;
  email: string;
  sessionId: string;
  userId: number;
  firstName: string;
  lastName: string;
}
// # region family-tree
export interface DFamilyTreeDAO {
  members: DFamilyMemberDTO[];
  userId: number;
  active?: boolean;
  treeName?: string;
  treeId?: number;
}
export interface DFamilyTreeRecord {
    id: number;
    authorized_ips: string;
    members: string;
    name: string;
    public: 1 | 0;
    active: 1 | 0;
    created_at: string;
    created_by: number;
    updated_at: string | null;
}
export interface DFamilyTreeDTO {
  id?: number;
  name?: string;
  members: {
    [memberId: string]: {
      id: string;
      name: string;
      type?: string;
      children?: string[];
      siblings?: string[];
      spouses?: string[];
    }
  }
}
export interface DFamilyMemberDTO {
  // Zogh attributes
  dob: string;
  email: string;
  first_name: string;
  gender: number; //1 || 2
  last_name: string;
  marital_status: string;
  occupation: string;
  dod?: string;
  id?: number;
  node_id: string;
  parents?: number[];
  age?: number;
  description?: string;
  profile_url?: string;
  userId?: number;
  // ReactFlow attributes
  nodeId?: string;
  name?: string;
  type?: NodeTypes;
  children?: DFamilyMemberDTO[];
  siblings?: DFamilyMemberDTO[];
  spouses?: DFamilyMemberDTO[];
}
export interface DReactFlowNode {
  id: string;
  age?: number;
  children?: string[];
  created_by?: number;
  data: any;
  description: string;
  dob: string;
  email: string;
  first_name: string;
  gender: number;
  last_name: string;
  marital_status: string;
  node_id: string;
  occupation: string;
  parents: string;
  profile_url: string;
  siblings?: string[];
  spouses?: string[];
  type?: string;
  user_id: number;
}