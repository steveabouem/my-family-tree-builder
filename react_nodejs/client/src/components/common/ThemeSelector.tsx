import React, { useContext, useState } from "react";
import { IoColorPaletteSharp } from "react-icons/io5";
import usePrimary from "../hooks/usePrimary.hook";
import { themeEnum } from "../../context/definitions";
import GlobalContext from "../../context/creators/global.context";

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const triggerColor = usePrimary();
  const { updateTheme } = useContext(GlobalContext);

  return (
    <div id="THEME">
      <div className="trigger" onClick={() => setIsOpen(!isOpen)} >
        <IoColorPaletteSharp color={triggerColor} />
      </div>
      {isOpen ? (
        <div className="choices">
          <div onClick={() => { if (updateTheme) updateTheme(themeEnum.dark) }} >
            <IoColorPaletteSharp color="#070707" />
          </div>
          <div onClick={() => { if (updateTheme) updateTheme(themeEnum.green) }} >
            <IoColorPaletteSharp color="#003231" />
          </div>
          <div onClick={() => { if (updateTheme) updateTheme(themeEnum.light) }} >
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