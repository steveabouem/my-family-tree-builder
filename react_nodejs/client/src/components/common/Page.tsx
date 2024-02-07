import React, { Suspense, useContext } from "react";
import { DPageProps } from "./definitions";
import Spinner from "./Spinner";
import useSession from "../hooks/useAuthValidation";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "../../context/creators/global.context";

const Page = ({ title, subtitle, children }: DPageProps): JSX.Element => {
  useSession();
  const { modal, theme, loading } = useContext(GlobalContext);

  return (
    <Suspense fallback={<Spinner />}>
      <div className={`page ${theme} primary`}>
        <h1 className="secondary">{title}</h1>
        {subtitle ? <h2 className="secondary">{subtitle}</h2> : ''}
        {loading ? <Spinner /> : null}
        {children || null}
      </div>
      <BaseModal
        hidden={modal?.hidden || true} id={modal?.id || ''}
        title={modal?.title || ''} content={modal?.content || ''}
        buttons={{cancel: modal?.buttons?.cancel || false, confirm: modal?.buttons?.confirm || false}}
      />
    </Suspense>
  );
};

export default Page;