import { useEffect, useState } from "react";

const useUrlId = (p_url: string): string => {
  const [param, setParam] = useState<string>('');
  
  useEffect(() => {
    setParam(window.location.pathname.replace(p_url, ''));
  }, [p_url]);

  return param;
}

export default useUrlId;