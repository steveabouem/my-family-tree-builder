import { DUserSession } from "services/api.definitions";
import { DFamilyTree } from "pages/tree/definitions";

export interface DFTContext {
  currentUser: Partial<DUserSession>;
  currentFamilyTree: Partial<DFamilyTree>;
  // ! -TOFIX: no any
  familyTrees: Partial<DFamilyTree>[];
  updateUser?: (values?: Partial<DUserSession>) => void;
  updateFamilyTrees?: (values: Partial<DFamilyTree>[]) => void;
  updateCurrentFamilyTree?: (values: Partial<DFamilyTree>) => void;
  error?: boolean;
};