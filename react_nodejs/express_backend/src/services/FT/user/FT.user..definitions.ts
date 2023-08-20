export interface DFTUserDTO {
    first_name: string,
    last_name: string,
    age: number,
    occupation: string,
    partner?: number,
    marital_status: string,
    password: string,
    email: string,
    is_parent: number,
    has_ipa?: number,
    gender: number, // 1: M, 2:F
    assigned_ips: string[],
    profile_url: string,
    description: string,
    imm_family: number,
    // TODO: replace with association
    realated_to: number[],
    created_at: Date,
    updated_at?: Date,
}