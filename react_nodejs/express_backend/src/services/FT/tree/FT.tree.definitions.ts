export interface DFamilyTreeDTO {
    authorized_ips: string[];
    public: boolean;
    name: string;
    active: boolean;
    created_by: number; //FTUser
    created_at: Date;
    updated_at: Date;
}

export type DFamilyTreeUpdateDTO = DFamilyTreeDTO & { id: number };