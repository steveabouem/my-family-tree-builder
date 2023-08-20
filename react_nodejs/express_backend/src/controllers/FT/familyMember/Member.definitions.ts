export interface DFamilyMemberRecord {
    first_name: string;
    last_name: string;
    age: string;
    occupation: string;
    partner: string; // FTUser
    marital_status: string;
    is_parent: number;
    description: string;
    gender: string; // 1:m 2:f
    profile_url: string;
    assigned_ip: string;
    has_ipa: number; //has authority to update authorized ips
    links_to: string;
    user_id: number;
    password: string;
    email: string;
}