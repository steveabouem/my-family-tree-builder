import { NodeTypes } from "@xyflow/react";
/*
* Holds declarations for all the API types, notably DTOs/DAOS
*/
interface DApiResponseRoot  {
  sessionId?: string;
  error: boolean;
  code: number;
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