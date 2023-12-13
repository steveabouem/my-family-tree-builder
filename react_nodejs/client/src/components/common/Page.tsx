import React, { useEffect } from "react";
import { DPageProps } from "./definitions";
import FTSpinner from "./FT.Spinner";
import useAuthValidation from "../hooks/useAuthValidation";

const Page = ({ title, subtitle, children, theme, isLoading }: DPageProps): JSX.Element => {
  useAuthValidation();

  return (
    <div className={`page ${theme} primary`}>
      <h1 className="secondary">{title}</h1>
      {subtitle ? <h2 className="secondary">{subtitle}</h2> : ''}
      {isLoading ? <FTSpinner /> : null}
      {children || null}
    </div>
  );
}

export default Page;