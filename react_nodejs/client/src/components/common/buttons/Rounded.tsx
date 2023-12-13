import React, { useState } from 'react';
import { DButtonProps } from "./definitions";

const ButtonRounded = ({active = true, action, text = 'Submit'}: DButtonProps) => {
  return (
    <button className="button rounded" type="submit" disabled={!active} onClick={action}>{text}</button>
  )
}

export default ButtonRounded;