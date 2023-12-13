import { useContext, useEffect, useState } from "react";
import GlobalContext from "../../context/global.context";
import { themeEnum } from "../../context/definitions";

const usePrimary = (): string => {
  const [primaryColor, setPrimaryColor] = useState<string>('white');
  const { theme } = useContext(GlobalContext);

  useEffect(() => {
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