import React, { Suspense, useContext } from "react";
import { DPageProps } from "./definitions";
import Spinner from "./Spinner";
import useSessionValidation from "../hooks/useAuthValidation";
import BaseModal from "./alerts/BaseModal";
import GlobalContext from "../../context/creators/global.context";
import { Container } from "react-bootstrap";

const Page = ({ title, subtitle, children }: DPageProps): JSX.Element => {
  useSessionValidation();
  const { modal, theme, loading } = React.useContext(GlobalContext);

  return (
    <Suspense fallback={<Spinner />}>
      <Container fluid className={`page ${theme} primary`}>
        <h1 className="secondary">{title}</h1>
        {subtitle ? <h2 className="secondary">{subtitle}</h2> : ''}
        {loading ? <Spinner /> : null}
        {children || null}
        <BaseModal
          hidden={modal?.hidden || true} id={modal?.id || ''}
          title={modal?.title || ''} content={modal?.content || ''}
          buttons={{ cancel: modal?.buttons?.cancel || false, confirm: modal?.buttons?.confirm || false }}
        />
      </Container>
    </Suspense>
  );
};

export default Page;