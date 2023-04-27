export interface DFTUserDTO {
    first_name: string,
    last_name: string,
    age: number,
    occupation: string,
    partner?: number,
    marital_status: string,
    password: string,
    email: string,
    is_parent: boolean,
    has_ipa?: boolean,
    gender: number, // 1: M, 2:F
    assigned_ips: string[],
    profile_url: string,
    description: string,
    imm_family: number,
    created_at: Date,
    updated_at?: Date,
}