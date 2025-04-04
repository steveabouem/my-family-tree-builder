import { DEndpointResponse } from "../controllers.definitions";
import { DFamilyMemberDAO } from "../familyMember/familyMember.definitions";
/*
* DAOs are typycally sent from front, and  expect the matching DTO in response
*/

// DAOs
export interface DFamilyTreeDAO {
    members: {[stepName: string]: DFamilyMemberDAO};
    userId: number;
    active?: boolean;
    treeName?: string;
}

//DTOs
export interface DFamilyTreeDTO {
    public: number;
    name: string;
    authorized_ips: string;
    id: number;
    created_at: Date;
    created_by: number;
    members: string;
    updated_at: Date;
    active: number;
}

export type DGetFamilyTreeResponse = DEndpointResponse & Partial<DFamilyTreeDTO> & {members?: {[nodeId: string]: DFamilyMemberDAO}};
export interface DSaveTreeFormStepResponse {
    lastStep: boolean;
    newFields: DStepFormFieldDTO[];
};

export type DStepFormFieldDTO = {
    fieldName: string;
    index: number;
    label: string;
};

export interface DReactFlowNode {
    id: string;
    name: string;
    children?: DFamilyMemberDAO[];
    siblings?: DFamilyMemberDAO[];
    spouses?: DFamilyMemberDAO[];
    type?: any;
}