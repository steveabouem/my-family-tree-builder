import { DUserDTO } from "../../../services/FT/auth/auth.definitions";

export interface DAuthProps {
  mode: DAuthMode | undefined;
  changeMode: (mode: DAuthMode | undefined) => void;
  id?: number;
}

export type DAuthMode = 'login' | 'register';