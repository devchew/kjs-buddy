import { useEffect, useState } from "react";

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockError, setWakeLockError] = useState("");
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      timer && clearTimeout(timer);
    };
  }, [timer]);

  const cleanup = () => {
    setWakeLock(null);
    setWakeLockActive(false);
    setWakeLockError("");
  };

  const toggleWakeLock = async (duration = 0) => {
    if (!wakeLockActive) {
      try {
        // Set wake lock
        const tempWakeLock = await window.navigator.wakeLock.request("screen");

        if (duration !== 0) {
          const tempTimer = setTimeout(() => {
            tempWakeLock.release();
            cleanup();
          }, duration);
          setTimer(tempTimer);
        }

        setWakeLock(tempWakeLock);
        setWakeLockActive(true);
        setWakeLockError("");
      } catch (err) {
        if (err instanceof DOMException) {
          setWakeLockError(`${err.name}, ${err.message}`);
        }
        if (err instanceof Error) {
          setWakeLockError(`${err.name}, ${err.message}`);
        }
        if (typeof err === "string") {
          setWakeLockError(err);
        }
      }
    } else {
      // Release wake lock
      wakeLock?.release();
      cleanup();
    }
  };

  return { toggleWakeLock, wakeLockActive, wakeLockError };
};
