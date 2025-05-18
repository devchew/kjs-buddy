import { useState } from "react";

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const goOnline = () => setIsOffline(false);
  const goOffline = () => setIsOffline(true);

  window.addEventListener("online", goOnline);
  window.addEventListener("offline", goOffline);

  return isOffline;
};
