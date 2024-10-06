import { DFTContext } from "contexts/creators/familyTree/familyTreeContext.types";
import { createContext } from "react";

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