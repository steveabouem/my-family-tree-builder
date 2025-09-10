import { FormField } from "components/common/definitions";

export type DKinsCount = {
  [kinshipEnum.siblings]: { display: boolean; total: number };
  [kinshipEnum.partner]: boolean;
  [kinshipEnum.parents]: { mother: { display: boolean }; father: { display: boolean } };
};
export interface StepsFieldsByKin {
  [kinshipEnum.siblings]: { fields: FormField[]; exist: boolean; total: number };
  [kinshipEnum.partner]?: FormField[];
  [kinshipEnum.parents]: { father?: FormField[], mother: FormField[] };
}
export interface FamilyTreeDTO {
  created_at: string;
  id:number;
  active: number; // 1 | 0
  authorized_ips:string;
  created_by: number;
  members:string; // JSON DFamilymemberDAO[]
  name?:string;
  public: number; // 1 | 0
}
export interface FamilyTreeFormData {
  // Base anchor fields (always present)
  anchor_node_id?: string;
  anchorNode?: string;
  treeName?: string;
  anchor_firstName?: string;
  anchor_lastName?: string;
  anchor_marital_status?: string;
  anchor_occupation?: string;
  anchor_dob?: string;
  anchor_gender?: number;
  anchor_email?: string;
  anchor_description?: string;
  next_of_kin?: string;
  [key: string]: string | number | undefined; 
  // // Dynamic kinship fields with reasonable limits
  // // Siblings (assuming max 10 siblings)
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_firstName`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_lastName`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_marital_status`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_occupation`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_dob`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_gender`]?: number;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_email`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_description`]?: string;
  
  // // Parents (max 2)
  // [K in `f-${1 | 2}_firstName`]?: string;
  // [K in `f-${1 | 2}_lastName`]?: string;
  // [K in `f-${1 | 2}_marital_status`]?: string;
  // [K in `f-${1 | 2}_occupation`]?: string;
  // [K in `f-${1 | 2}_dob`]?: string;
  // [K in `f-${1 | 2}_gender`]?: number;
  // [K in `f-${1 | 2}_email`]?: string;
  // [K in `f-${1 | 2}_description`]?: string;
  
  // [K in `m-${1 | 2}_firstName`]?: string;
  // [K in `m-${1 | 2}_lastName`]?: string;
  // [K in `m-${1 | 2}_marital_status`]?: string;
  // [K in `m-${1 | 2}_occupation`]?: string;
  // [K in `m-${1 | 2}_dob`]?: string;
  // [K in `m-${1 | 2}_gender`]?: number;
  // [K in `m-${1 | 2}_email`]?: string;
  // [K in `m-${1 | 2}_description`]?: string;
  
  // // Partner (max 1)
  // [K in `h-1_firstName`]?: string;
  // [K in `h-1_lastName`]?: string;
  // [K in `h-1_marital_status`]?: string;
  // [K in `h-1_occupation`]?: string;
  // [K in `h-1_dob`]?: string;
  // [K in `h-1_gender`]?: number;
  // [K in `h-1_email`]?: string;
  // [K in `h-1_description`]?: string;
  
  // [K in `w-1_firstName`]?: string;
  // [K in `w-1_lastName`]?: string;
  // [K in `w-1_marital_status`]?: string;
  // [K in `w-1_occupation`]?: string;
  // [K in `w-1_dob`]?: string;
  // [K in `w-1_gender`]?: number;
  // [K in `w-1_email`]?: string;
  // [K in `w-1_description`]?: string;
}
export enum kinshipEnum {
  'parents' = 'parents',
  'siblings' = "siblings",
  'partner' = "partner",
}
export enum orientationEnum {
  'vertical' = 'vertical',
  'horizontal' = 'horizontal',
}