import React from "react";
import { DFamilyDTO } from "./definitions";

const FamilyCard = (props: DFamilyDTO): JSX.Element => {
  return (
    <div className="">
      <h3>{props.name} Family</h3>
      <div>
        {props.members.length} members
      </div>
      <div>
        <h4>Summary</h4>
        {props.description}
      </div>
    </div>
  );


};

export default FamilyCard;
