import { DFormField } from "@components/common/definitions";

export type DKinsCount = {
  [kinshipEnum.siblings]: {display: boolean; total: number};
  [kinshipEnum.partner]: boolean;
  [kinshipEnum.parents]: {mother:{display: boolean}; father: {display: boolean}};
};
export interface DStepsFieldsByKin {
  [kinshipEnum.siblings]: {fields: DFormField[]; exist: boolean; total: number};
  [kinshipEnum.partner]?: DFormField[];
  [kinshipEnum.parents]: {father?: DFormField[], mother: DFormField[]};
}
export enum kinshipEnum  {
  'parents' = 'parents',
  'siblings' = "siblings",
  'partner' = "partner",
}