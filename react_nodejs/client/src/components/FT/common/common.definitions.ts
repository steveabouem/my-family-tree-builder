import { ReactNode } from "react";
import { applicationEnum } from "../../../context/global.context";

export interface DAppProps {
  app?: applicationEnum
  children?: ReactNode;
}