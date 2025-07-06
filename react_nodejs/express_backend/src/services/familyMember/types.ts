import { APIFamilyMemberDAO } from "../../controllers/familyMember/familyMember.definitions";
export interface MemberCreationResult {
  [nodeId: string]: APIFamilyMemberDAO;
}

export interface MemberUpdateResult {
  [nodeId: string]: APIFamilyMemberDAO;
} 