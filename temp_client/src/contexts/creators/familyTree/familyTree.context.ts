import { createContext } from "react";
import { FTContext } from "types";

export interface ContextMutator<GEntity> {
  entity: string;
  action: (values?: Partial<GEntity>) => void;
}

const FamilyTreeContext = createContext<FTContext>({
  currentFamilyTree: {},
  familyTrees: [],
  updateUser: undefined,
  updateFamilyTrees: undefined,
  updateCurrentFamilyTree: undefined,
});

export default FamilyTreeContext;