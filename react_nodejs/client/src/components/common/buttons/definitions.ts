import { ReactNode } from "react";

export interface DButtonProps {
  action: () => void;
  active?: boolean;
  text?: string | ReactNode;
}