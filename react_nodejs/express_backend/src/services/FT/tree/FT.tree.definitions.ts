export interface DFamilyTreeDTO {
    authorized_ips: string;
    public: boolean;
    name: string;
    active: boolean;
    families: string;
    created_by: number; //FTUser
    created_at: Date;
    updated_at: Date;
}

export type DFamilyTreeUpdateDTO = Partial<DFamilyTreeDTO>