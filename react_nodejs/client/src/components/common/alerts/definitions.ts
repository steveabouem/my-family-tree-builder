import { ReactNode } from "react";
import { DModalType } from "../definitions";

export interface DModalProps {
  hidden: boolean;
  id: string;
  title: string | ReactNode;
  buttons: {cancel: boolean, confirm: boolean};
  type: DModalType;
  onConfirm?: () => void;
  onCancel?: () => void;
  content?: string | ReactNode;
  children?: ReactNode;
}