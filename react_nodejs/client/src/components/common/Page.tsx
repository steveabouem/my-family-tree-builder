import React, { Suspense, useContext } from "react";
import { DPageProps } from "./definitions";
import Spinner from "./Spinner";
import useSession from "../hooks/useAuthValidation";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "../../context/creators/global.context";

const Page = ({ title, subtitle, children, isLoading }: DPageProps): JSX.Element => {
  useSession();
  const { modal, theme } = useContext(GlobalContext);

  return (
    <Suspense fallback={<Spinner />}>
      <div className={`page ${theme} primary`}>
        <h1 className="secondary">{title}</h1>
        {subtitle ? <h2 className="secondary">{subtitle}</h2> : ''}
        {isLoading ? <Spinner /> : null}
        {children || null}
      </div>
      {
        modal ?
          <BaseModal
            hidden={modal?.hidden || true} id={modal?.id || ''}
            title={modal?.title || ''} content={modal?.content || ''}
          />
          : null}
    </Suspense>
  );
}

export default Page;