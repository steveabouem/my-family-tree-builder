import { APIEndpointResponse } from "../controllers.definitions";
import { APIFamilyMemberDAO } from "../familyMember/familyMember.definitions";
/*
* DAOs are typycally sent from front, and  expect the matching DTO in response
*/

// DAOs
export interface APIFamilyTreeDAO {
    members: {[stepName: string]: APIFamilyMemberDAO};
    userId: number;
    active?: boolean;
    treeName?: string;
    treeId?: number;
}

//DTOs
export interface APIFamilyTreeDTO {
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

export type APIGetFamilyTreeResponse = APIEndpointResponse & Partial<APIFamilyTreeDTO> & {members?: {[nodeId: string]: APIFamilyMemberDAO}};
export interface DSaveTreeFormStepResponse {
    lastStep: boolean;
    newFields: APIStepFormFieldDTO[];
};

export type APIStepFormFieldDTO = {
    fieldName: string;
    index: number;
    label: string;
};

export interface APIReactFlowNode {
    id: string;
    name: string;
    children?: APIFamilyMemberDAO[];
    siblings?: APIFamilyMemberDAO[];
    spouses?: APIFamilyMemberDAO[];
    type?: any;
}