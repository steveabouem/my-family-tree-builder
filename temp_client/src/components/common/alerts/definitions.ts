import { ReactNode } from "react";
import { DModalType } from "../definitions";

export interface ModalProps {
  hidden: boolean;
  id: string;
  title: string | ReactNode;
  buttons: {cancel: boolean, confirm: boolean};
  type: DModalType;
  transferData?: any;
  onConfirm?: (v?: any) => void;
  onCancel?: (v?: any) => void;
  content?: string | ReactNode;
  children?: ReactNode;
}