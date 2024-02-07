import React from "react";
import { DFamilyTree } from "../tree/definitions";

const FamilyCard = (props: Partial<DFamilyTree>): JSX.Element => {
  return (
    <div className="">
      <h3>{props.name} Family Tree</h3>
    </div>
  );


};

export default FamilyCard;
