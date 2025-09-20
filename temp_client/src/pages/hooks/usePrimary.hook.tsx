import GlobalContext from "contexts/creators/global/global.context";
import { themeEnum } from "types";
import React from "react";

const usePrimary = (): string => {
  const [primaryColor, setPrimaryColor] = React.useState<string>('#fff');
  const { theme } = React.useContext(GlobalContext);

  React.useEffect(() => {
    if (theme === themeEnum.dark) {
      setPrimaryColor('#fff');
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