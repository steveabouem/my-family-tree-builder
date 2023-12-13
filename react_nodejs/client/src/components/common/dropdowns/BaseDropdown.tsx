import React, { useState } from "react";
import { HiBarsArrowDown, HiBarsArrowUp } from "react-icons/hi2";
import { DBaseDropDownProps, DDropdownOption } from "./definitions";
import('./styles.scss');

const BaseDropDown = ({ id, label, options, additionalClass, onValueChange, val, displayVal }: DBaseDropDownProps): JSX.Element => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const updateVal = (option: DDropdownOption) => {
    onValueChange(option);
    setOpen(false);
  }


  return (
    <div className={`dropdown-container + ${additionalClass || ''}`} id={id || ''}>
      {label || ''}
      <div className="dd-trigger" onClick={() => setOpen(!isOpen)}>
        <div>{displayVal || ''}</div>
        {isOpen ? <HiBarsArrowUp className={isOpen ? 'accent' : ''} /> : <HiBarsArrowDown className={isOpen ? 'accent' : ''} />}
      </div>
      {isOpen ? <div className="dd-options-container accent-bg">
        {options.map((option: DDropdownOption, i: number) => {
          return (
            <div
              className={`dd-options  ${option.additionalClass || ''} ${val === option.value ? ' selected' : ''}`}
              key={`dd-opt-${i}`}
              onClick={() => {
                console.log('SELECTING OPT', option);
                updateVal(option);
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