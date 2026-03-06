import React from "react";

const useCookie = (): string | undefined => {
  const [cookie, setCookie] = React.useState<string | undefined>();

  React.useEffect(() => {
    const cookies =  document.cookie.split(';');
    const appCookie = cookies.find((c: string) => c.trim().startsWith('FT='));
    
    setCookie(appCookie);
  });

  return cookie;
}

export default useCookie;