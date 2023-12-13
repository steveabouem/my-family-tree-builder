import react, { useEffect, useState } from "react";

const useCookie = (): string | undefined => {
  const [cookie, setCookie] = useState<string | undefined>();

  useEffect(() => {
    const cookies =  document.cookie.split(';');
    const appCookie = cookies.find((c: string) => c.trim().startsWith('FT='));
    
    setCookie(appCookie);
  });

  return cookie;
}

export default useCookie;