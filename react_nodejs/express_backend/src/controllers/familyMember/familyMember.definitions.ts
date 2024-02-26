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