export interface DFamilyMemberRecord {
    id: number;
    age: number;
    description: string;
    first_name: string;
    gender: number; //1 || 2
    parent_1: number;
    parent_2: number;
    email: string;
    last_name: string;
    tree_id: number;
    marital_status: string;
    occupation: string;
    partner: number;
    profile_url: string;
    created_by: number;
    created_at: Date;
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