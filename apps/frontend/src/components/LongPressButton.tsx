import {
  useState,
  useEffect,
  useRef,
  PropsWithChildren,
  FunctionComponent,
} from "react";
import style from "./LongPressButton.module.css";
import { Button } from "./Button";

interface LongPressButtonProps {
  onLongPress: () => void;
  delay?: number;
  onClick?: () => void;
}

export const LongPressButton: FunctionComponent<
  PropsWithChildren<LongPressButtonProps>
> = ({ onLongPress, delay = 800, children, onClick }) => {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  // Update progress bar width when progress changes
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
  }, [progress]);

  const startPressing = () => {
    setPressing(true);
    setProgress(0);

    const intervalTime = 10; // Update every 10ms for smooth animation
    const startTime = Date.now();

    const intervalId = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min((elapsedTime / delay) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalId);
        onLongPress();
        setPressing(false);
      }
    }, intervalTime);

    setTimer(intervalId);
  };

  const stopPressing = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setPressing(false);
    setProgress(0);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={style.container}>
      <Button
        onMouseDown={startPressing}
        onMouseUp={stopPressing}
        onMouseLeave={stopPressing}
        onTouchStart={startPressing}
        onTouchEnd={stopPressing}
        onTouchCancel={stopPressing}
        onClick={handleClick}
        primary
      >
        {children}
      </Button>
      {pressing && (
        <div className={style.progressContainer}>
          <div ref={progressBarRef} className={style.progressBar} />
        </div>
      )}
    </div>
  );
};
