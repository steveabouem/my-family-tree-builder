import React from "react";
import Dayjs from 'dayjs';

const Footer = () => {

  return (
    <div>
      <div className="date">{Dayjs().format('DD-MM-YYYY')}</div>
    </div>
  );
}

export default Footer;