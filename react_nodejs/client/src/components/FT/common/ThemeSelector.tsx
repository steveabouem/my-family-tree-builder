import React, { useState } from "react";
import { DThemeSelectorProps } from "./common.definitions";
import { themeEnum } from "../../../context/global.context";
import { IoColorPaletteSharp } from "react-icons/io5";
import usePrimary from "../../hooks/usePrimary.hook";

const ThemeSelector = ({ switchTheme }: DThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const triggerColor = usePrimary();

  return (
    <div id="THEME">
      <div className="trigger" onClick={() => setIsOpen(!isOpen)} >
        <IoColorPaletteSharp color={triggerColor} />
      </div>
      {isOpen ? (
        <div className="choices">
          <div onClick={() => switchTheme(themeEnum.dark)} >
            <IoColorPaletteSharp color="#070707" />
          </div>
          <div onClick={() => switchTheme(themeEnum.green)} >
            <IoColorPaletteSharp color="#003231" />
          </div>
          <div onClick={() => switchTheme(themeEnum.light)} >
            <IoColorPaletteSharp color="#fff" />
          </div>
        </div>
      ) : null}
      <div>
      </div>
    </div>
  )

}
export default ThemeSelector;