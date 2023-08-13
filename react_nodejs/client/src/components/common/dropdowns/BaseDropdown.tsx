import React, { useState } from "react";
import { HiBarsArrowDown, HiBarsArrowUp } from "react-icons/hi2";
import { DBaseDropDownProps, DDropdownOption } from "./definitions";
import('./styles.scss');

const BaseDropDown = ({ id, label, options, additionalClass, }: DBaseDropDownProps): JSX.Element => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<DDropdownOption | undefined>();

  return (
    <div className={`dropdown-container + ${additionalClass || ''}`} id={id || ''}>
      {label}
      <div className="dd-trigger" onClick={() => setOpen(!isOpen)}>
        <div>{selected?.label}</div>
        {isOpen ? <HiBarsArrowUp className={isOpen ? 'accent' : ''} /> : <HiBarsArrowDown className={isOpen ? 'accent' : ''}/>}
      </div>
      {isOpen ? <div>
        {options.map((option: DDropdownOption, i: number) => {
          return (
            <div 
              className={`dd-options  ${option.additionalClass || ''} ${selected === option ? ' selected' : ''}`}
              key={`dd-opt-${i}`} 
              onClick={() => {
                setSelected(option);
                setOpen(false);
            }}>
              <div
                className={`dd-option-inner`}
              >{option.label}</div>
            </div>
          );
        })}
      </div> : null}
    </div>
  );
}

export default BaseDropDown;