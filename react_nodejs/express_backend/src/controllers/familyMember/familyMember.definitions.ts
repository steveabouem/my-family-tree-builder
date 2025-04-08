/*
* DAOs are typycally sent from front, and  expect the matching DTO in response
*/

// DAOs
export interface DFamilyMemberDAO {
    // Zogh attributes
    dob: string;
    node_id: string;
    email: string;
    first_name: string;
    gender: number; //1 || 2
    last_name: string;
    marital_status: string;
    occupation: string;
    parents?: number[];
    age?: number;
    description?: string;
    profile_url?: string;
    userId?: number;
    // ReactFlow attributes
    nodeId?: string;
    name?: string;
    type?: string;
    position?: { x: number; y: number };
    children?: DFamilyMemberDAO[];
    siblings?: DFamilyMemberDAO[];
    spouses?: DFamilyMemberDAO[];
}

// DTOs
export interface DFamilyMemberDTO {
    age: number;
    created_at: Date;
    created_by: number;
    description: string;
    email: string;
    first_name: string;
    gender: number; //1 || 2
    id: number;
    last_name: string;
    marital_status: string;
    occupation: string;
    parent_1: number;
    parent_2: number;
    partner: number;
    profile_url: string;
    tree_id: number;
    updated_at: Date;
}


export interface DFamilyTreeNodeDTO {
    age: number;
    first_name: string;
    last_name: string;
    marital_status: string;
    description?: string;
    email?: string;
    occupation?: string;
    profile_url?: string;

    // RFT OBJECT
    id: string;
    gender: "male" | "female";
    parents: {
        id: string,
        type: "blood"
    }[];
    siblings?: {
        id: string,
        type: "blood"
    }[];
    spouses?: {
        id: string,
        type: "married" | "separated"
    }[];
    children?: {
        id: string,
        type: "blood"
    }[];
}