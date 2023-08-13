import react, { useEffect, useState } from "react";

const useCookie = (): string | undefined => {
  const [cookie, setCookie] = useState<string | undefined>();
  useEffect(() => {
    setCookie(document.cookie);
  });

  return cookie;
}

export default useCookie;