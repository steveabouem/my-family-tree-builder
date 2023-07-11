import React from "react";
import { DPageProps } from "./definitions";
import FTSpinner from "../FT/common/FT.Spinner";

const Page = ({ title, subTitle, children, theme, isLoading }: DPageProps): JSX.Element => {
  return (
    <div className={`page ${theme} primary`}>
      <h1 className="secondary">{title}</h1>
      {subTitle ? <h2 className="secondary">{subTitle}</h2> : ''}
      {isLoading ? <FTSpinner /> : null}
      {children}
    </div>
  );
}

export default Page;