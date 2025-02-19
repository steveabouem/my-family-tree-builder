import React from "react";
import { IoColorPaletteSharp } from "react-icons/io5";
import usePrimary from "../../pages/hooks/usePrimary.hook";
import GlobalContext from "contexts/creators/global/global.context";
import { themeEnum } from "contexts/creators/global/globalContext.types";
import { Box } from "@mui/material";

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const triggerColor = usePrimary();
  const { updateTheme } = React.useContext(GlobalContext);

  return (
    <Box>
      <Box className="trigger" onClick={() => setIsOpen(!isOpen)} >
        <IoColorPaletteSharp color={triggerColor} />
      </Box>
      {/* {isOpen ? (
        <Box className="choices">
          <Box onClick={() => { if (updateTheme) updateTheme(themeEnum.dark) }} >
            <IoColorPaletteSharp color="#070707" />
          </Box>
          <Box onClick={() => { if (updateTheme) updateTheme(themeEnum.green) }} >
            <IoColorPaletteSharp color="#003231" />
          </Box>
          <Box onClick={() => { if (updateTheme) updateTheme(themeEnum.light) }} >
            <IoColorPaletteSharp color="#fff" />
          </Box>
        </Box>
      ) : null} */}
      <Box>
      </Box>
    </Box>
  )

}
export default ThemeSelector;