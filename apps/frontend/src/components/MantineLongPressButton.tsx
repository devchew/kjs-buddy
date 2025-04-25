import { ReactNode, useState, useEffect } from 'react';
import { Button, ButtonProps, Progress, Box } from '@mantine/core';

interface MantineLongPressButtonProps extends ButtonProps {
  onLongPress: () => void;
  delay?: number;
  children: ReactNode;
}

export function MantineLongPressButton({
  onLongPress,
  delay = 800,
  children,
  ...buttonProps
}: MantineLongPressButtonProps) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

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

  return (
    <Box pos="relative">
      <Button
        onMouseDown={startPressing}
        onMouseUp={stopPressing}
        onMouseLeave={stopPressing}
        onTouchStart={startPressing}
        onTouchEnd={stopPressing}
        onTouchCancel={stopPressing}
        {...buttonProps}
      >
        {children}
      </Button>
      {pressing && (
        <Progress 
          value={progress} 
          size="xs" 
          radius="xs" 
          pos="absolute" 
          bottom={0} 
          left={0} 
          w="100%" 
        />
      )}
    </Box>
  );
}