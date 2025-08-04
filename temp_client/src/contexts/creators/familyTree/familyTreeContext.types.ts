import { DUserSession } from "services/api.definitions";
import { DFamilyTree } from "pages/tree/definitions";

export interface DFTContext {
  currentFamilyTree: Partial<DFamilyTree>;
  familyTrees: Partial<DFamilyTree>[];
  updateUser?: (values?: Partial<DUserSession>) => void;
  updateFamilyTrees?: (values: Partial<DFamilyTree>[]) => void;
  updateCurrentFamilyTree?: (values: Partial<DFamilyTree>) => void;
  error?: boolean;
};