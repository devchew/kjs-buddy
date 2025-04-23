import { useCallback, useEffect, useRef, useState } from 'react';

type LongPressOptions = {
  shouldPreventDefault?: boolean;
  delay?: number;
};

export const useLongPress = (
  onLongPress: () => void,
  onClick: () => void = () => {},
  { shouldPreventDefault = true, delay = 800 }: LongPressOptions = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const animationFrame = useRef<number>();
  const startTime = useRef<number>(0);
  const target = useRef<EventTarget>();

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  // Use useEffect to handle progress updates instead of callback with dependencies
  useEffect(() => {
    if (!isHolding) return;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.min(100, (elapsed / delay) * 100);
      setProgress(newProgress);
      
      if (newProgress < 100 && isHolding) {
        animationFrame.current = requestAnimationFrame(updateProgress);
      }
    };
    
    animationFrame.current = requestAnimationFrame(updateProgress);
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isHolding, delay]);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        event.preventDefault();
      }
      
      target.current = event.target;
      startTime.current = Date.now();
      setIsHolding(true);
      setProgress(0);
      
      timeout.current = setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
        setIsHolding(false);
        setProgress(100);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      if (timeout.current) clearTimeout(timeout.current);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      
      shouldTriggerClick && !longPressTriggered && onClick();
      setLongPressTriggered(false);
      setIsHolding(false);
      setProgress(0);
      
      // Reset target for next interaction
      target.current = undefined;
    },
    [onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
    isHolding,
    progress
  };
};