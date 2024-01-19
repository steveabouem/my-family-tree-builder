export interface DFamilyTreeDTO {
    authorized_ips: string;
    public: number;
    name: string;
    active: number;
    families: string;
    created_by: number; //User
    created_at: Date;
    updated_at: Date;
}

export type DFamilyTreeUpdateDTO = Partial<DFamilyTreeDTO>