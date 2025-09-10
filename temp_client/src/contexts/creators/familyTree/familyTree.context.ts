import { createContext } from "react";
import { DFTContext } from "./familyTreeContext.types";

export interface ContextMutator<GEntity> {
  entity: string;
  action: (values?: Partial<GEntity>) => void;
}

const FamilyTreeContext = createContext<DFTContext>({
  currentFamilyTree: {},
  familyTrees: [],
  updateUser: undefined,
  updateFamilyTrees: undefined,
  updateCurrentFamilyTree: undefined,
});

export default FamilyTreeContext;