import React, { useContext } from "react";
import Dayjs from 'dayjs';
import GlobalContext from "../../../context/global.context";
import ('../styles.scss');

const Footer = () => {
  const { theme } = useContext(GlobalContext);

  return (
    <div className={`${theme} footer primary-bg position-absolute bottom-0 w-100 px-2`}>
      <div className="date">{Dayjs().format('DD-MM-YYYY')}</div>
    </div>
  );
}

export default Footer;