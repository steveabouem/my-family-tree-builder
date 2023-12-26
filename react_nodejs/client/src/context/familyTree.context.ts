import { createContext } from "react";
import { DUserDTO } from "../services/auth/auth.definitions";
import { DeepPartial } from "redux";
import { DFamilyDTO } from "../components/family/definitions";

interface DFTContext {
  currentUser: DeepPartial<DUserDTO>;
  family: DeepPartial<DFamilyDTO>;
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
  updateUser: function (user?: Partial<DUserDTO>) {
    console.log('Reference in context', this.currentUser);
    if (user)
    this.currentUser = user;
  }
});

export default FamilyTreeContext;