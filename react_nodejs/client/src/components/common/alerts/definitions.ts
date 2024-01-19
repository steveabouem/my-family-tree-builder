import { ReactNode } from "react";

export interface DModalProps {
  hidden: boolean;
  id: string;
  title: string | ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  content?: string | ReactNode;
  children?: ReactNode;
}