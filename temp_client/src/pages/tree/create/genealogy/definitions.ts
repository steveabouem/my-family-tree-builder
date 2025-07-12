import { DFormField } from "@components/common/definitions";

export type DKinsCount = {
  [kinshipEnum.siblings]: { display: boolean; total: number };
  [kinshipEnum.partner]: boolean;
  [kinshipEnum.parents]: { mother: { display: boolean }; father: { display: boolean } };
};
export interface DStepsFieldsByKin {
  [kinshipEnum.siblings]: { fields: DFormField[]; exist: boolean; total: number };
  [kinshipEnum.partner]?: DFormField[];
  [kinshipEnum.parents]: { father?: DFormField[], mother: DFormField[] };
}
export interface DFamilyTreeDTO {
  created_at: string;
  id:number;
  active: number; // 1 | 0
  authorized_ips:string;
  created_by: number;
  members:string; // JSON DFamilymemberDAO[]
  name?:string;
  public: number; // 1 | 0
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