import React from "react";
import { IoColorPaletteSharp } from "react-icons/io5";
import usePrimary from "../hooks/usePrimary.hook";
import GlobalContext from "contexts/creators/global/global.context";
import { themeEnum } from "contexts/creators/global/globalContext.types";
import { Box } from "@mui/material";

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const triggerColor = usePrimary();
  const { updateTheme } = React.useContext(GlobalContext);

  return (
    <Box>
      <div className="trigger" onClick={() => setIsOpen(!isOpen)} >
        <IoColorPaletteSharp color={triggerColor} />
      </div>
      {/* {isOpen ? (
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
      ) : null} */}
      <div>
      </div>
    </Box>
  )

}
export default ThemeSelector;