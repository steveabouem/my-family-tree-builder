import { createContext } from "react";
import { DUserDTO, DUserSession } from "../../services/auth/auth.definitions";
import { DFamilyDTO } from "../../components/family/definitions";
import { DFamilyTree } from "../../components/tree/definitions";

interface DFTContext {
  currentUser: Partial<DUserSession>;
  // family: DeepPartial<DFamilyDTO>;
  // ! -TOFIX: no any
  familyTrees: Partial<DFamilyTree>[];
  updateUser?: (values?: Partial<DUserSession>) => void;
  updateFamilyTrees?: (values: Partial<DFamilyTree>[]) => void;
  error?: boolean;
};

export interface DContextMutator<GEntity> {
  entity: string;
  action: (values?: Partial<GEntity>) => void;
}

const FamilyTreeContext = createContext<DFTContext>({
  currentUser: {},
  // family: {},
  familyTrees: [],
  updateUser: undefined,
  updateFamilyTrees: undefined,
});

export default FamilyTreeContext;