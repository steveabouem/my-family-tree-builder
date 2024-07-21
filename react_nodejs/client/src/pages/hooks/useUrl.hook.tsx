import { useEffect, useState } from "react";

const useUrlId = (url: string): string => {
  const [param, setParam] = React.useState<string>('');
  
  React.useEffect(() => {
    setParam(window.location.pathname.replace(url, ''));
  }, [url]);

  return param;
}

export default useUrlId;