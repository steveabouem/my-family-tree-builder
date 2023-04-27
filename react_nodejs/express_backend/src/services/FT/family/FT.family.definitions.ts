export interface DFTFamDTO {
    base_location: string; // use google places autocomplete
    description: string;
    head_1: number; // FTUser
    head_2: number; // ?FTUser
    head_count: number;
    tree: number;
    linked_fams: number[]; // FTFam
    name: string;
    profile_url: string;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}

export type DFTFamUpdateDTO = Partial<DFTFamDTO>