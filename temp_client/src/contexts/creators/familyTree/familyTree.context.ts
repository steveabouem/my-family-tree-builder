import { createContext } from "react";
import { DFTContext } from "./familyTreeContext.types";

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