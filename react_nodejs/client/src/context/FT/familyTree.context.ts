import { createContext } from "react";
import { DUserDTO } from "../../services/FT/auth/auth.definitions";
import { DeepPartial } from "redux";
import { DFTFamilyDTO } from "../../components/FT/family/definitions";

interface DFTContext {
  currentUser: DeepPartial<DUserDTO>;
  family: DeepPartial<DFTFamilyDTO>;
  // TODO: no any
  tree: any;
  updateUser: (values?: Partial<DUserDTO>) => void;
  error?: boolean;
};

export interface DContextMutator<GEntity> {
  entity: string;
  action: (values?: Partial<GEntity>) => void;
}

const FamilyTreeContext = createContext<DFTContext>({
  currentUser: {},
  family: {},
  tree: undefined,
  updateUser: function () { }
});

export default FamilyTreeContext;