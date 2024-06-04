import React from "react";
import GlobalContext from "../../context/creators/global.context";
import { themeEnum } from "../../context/definitions";

const usePrimary = (): string => {
  const [primaryColor, setPrimaryColor] = React.useState<string>('white');
  const { theme } = React.useContext(GlobalContext);

  React.useEffect(() => {
    if (theme === themeEnum.dark) {
      setPrimaryColor('white');
    }
    if (theme === themeEnum.green) {
      setPrimaryColor('#d39a49');
    }
    if (theme === themeEnum.light) {
      setPrimaryColor('black');
    }
  }, [theme]);

  return primaryColor;
}

export default usePrimary;