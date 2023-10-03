import { useEffect, useState } from "react";

const useUrlId = (url: string): string => {
  const [param, setParam] = useState<string>('');
  
  useEffect(() => {
    setParam(window.location.pathname.replace(url, ''));
  }, [url]);

  return param;
}

export default useUrlId;