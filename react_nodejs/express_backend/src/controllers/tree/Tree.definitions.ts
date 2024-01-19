export interface DFamilyTreeRecord {
    public: number;
    name: string;
    authorized_ips: string[];
    id: number;
    created_at: Date;
    created_by: number;
    families: number[];
    updated_at: Date;
    active: boolean;
}