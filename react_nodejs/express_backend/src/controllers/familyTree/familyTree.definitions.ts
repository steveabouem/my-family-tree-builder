import { APIEndpointResponse } from "../controllers.definitions";
import { APIFamilyMemberDAO } from "../familyMember/familyMember.definitions";
/*
* DAOs are typycally sent from front, and  expect the matching DTO in response
*/

// DAOs
export interface APIFamilyTreeDAO {
    //! TODO: keep an eye here, it was previously an object keyed with the noe id for the front. the conversion functions will be used for that if necessary
    members: APIFamilyMemberDAO[];
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
    updated_at: Date;
    active: number;
}

export type APIGetFamilyTreeResponse = Partial<APIFamilyTreeDTO> & {members?: APIFamilyMemberDAO[]};

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