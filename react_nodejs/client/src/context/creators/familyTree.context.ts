import { createContext } from "react";
import { DUserSession } from "../../services/auth/auth.definitions";
import { DFamilyTree } from "../../pages/tree/definitions";

interface DFTContext {
  currentUser: Partial<DUserSession>;
  currentFamilyTree: Partial<DFamilyTree>;
  // ! -TOFIX: no any
  familyTrees: Partial<DFamilyTree>[];
  updateUser?: (values?: Partial<DUserSession>) => void;
  updateFamilyTrees?: (values: Partial<DFamilyTree>[]) => void;
  updateCurrentFamilyTree?: (values: Partial<DFamilyTree>) => void;
  error?: boolean;
};

export interface DContextMutator<GEntity> {
  entity: string;
  action: (values?: Partial<GEntity>) => void;
}

const FamilyTreeContext = createContext<DFTContext>({
  currentUser: {},
  currentFamilyTree: {},
  familyTrees: [],
  updateUser: undefined,
  updateFamilyTrees: undefined,
  updateCurrentFamilyTree: undefined,
});

export default FamilyTreeContext;