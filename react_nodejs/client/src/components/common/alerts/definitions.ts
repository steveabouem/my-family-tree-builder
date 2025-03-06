import { ReactNode } from "react";

export interface DModalProps {
  hidden: boolean;
  id: string;
  title: string | ReactNode;
  buttons: {cancel: boolean, confirm: boolean};
  type: 'error' | 'success' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
  content?: string | ReactNode;
  children?: ReactNode;
}