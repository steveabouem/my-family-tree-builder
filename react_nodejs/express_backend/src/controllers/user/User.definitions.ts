export interface DFTUserRecord {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    tasks: string;
    roles: string;
    authorizedIps: string;
    ip_authority: number;
}

export interface DFTUserDTO {
    first_name: string,
    last_name: string,
    age: number,
    occupation: string,
    id: number;
    marital_status: string,
    password: string,
    email: string,
    is_parent: number,
    parent_1: number | null,
    parent_2: number | null,
    gender: number, // 1: M, 2:F
    assigned_ips: string[],
    profile_url: string,
    description: string,
    imm_family: number,
    has_ipa?: number,
    partner?: number,
    // TODO: replace with association
    realated_to: number[],
    created_at: Date,
    updated_at?: Date,
}