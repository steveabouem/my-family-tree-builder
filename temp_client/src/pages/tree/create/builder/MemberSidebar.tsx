import React, { useState } from "react";
import MemberSidebarForm from "./MemberSidebarForm";
import BoxColumn from "components/common/containers/row/BoxColumn";

const MemberSidebar = () => {
  return (
    <BoxColumn>
      <form name="gen">
        <MemberSidebarForm />
      </form>
    </BoxColumn>
  );
};

export default MemberSidebar;