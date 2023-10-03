import { useContext, useEffect, useState } from "react";
import GlobalContext, { themeEnum } from "../../context/global.context";

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