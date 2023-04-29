export interface DFTFamDTO {
    base_location: string; // google api
    description: string;
    head_1: number; // FTUser
    head_2: number; // ?FTUser
    head_count: number;
    tree: number; // FTTree
    name: string;
    members: string;
    profile_url: string;
    created_by: number; // FTUser
    created_at: Date;
    updated_at: Date;
}

// TODO: this will be obsolet very SVGComponentTransferFunctionElement. 
// Just pass id as a second arg
export type DFTFamUpdateDTO = Partial<DFTFamDTO>