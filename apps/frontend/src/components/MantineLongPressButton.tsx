import { ReactNode, useState, useEffect, ButtonHTMLAttributes } from 'react';

interface LongPressButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onLongPress: () => void;
  delay?: number;
  children: ReactNode;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  variant?: string;
}

export function MantineLongPressButton({
  onLongPress,
  delay = 800,
  children,
  color = 'blue',
  size = 'md',
  fullWidth = false,
  variant = 'filled',
  ...buttonProps
}: LongPressButtonProps) {
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

  // Map size values to pixel values for padding and font size
  const sizeStyles = {
    xs: { padding: '4px 8px', fontSize: '0.75rem' },
    sm: { padding: '6px 12px', fontSize: '0.875rem' },
    md: { padding: '8px 16px', fontSize: '1rem' },
    lg: { padding: '12px 20px', fontSize: '1.125rem' },
    xl: { padding: '16px 24px', fontSize: '1.25rem' }
  };

  // Map colors and variants
  const getButtonStyles = () => {
    const colorMap: Record<string, { backgroundColor: string, color: string, borderColor?: string }> = {
      blue: { backgroundColor: variant === 'filled' ? '#228be6' : 'transparent', color: variant === 'filled' ? 'white' : '#228be6', borderColor: '#228be6' },
      green: { backgroundColor: variant === 'filled' ? '#2b8a3e' : 'transparent', color: variant === 'filled' ? 'white' : '#2b8a3e', borderColor: '#2b8a3e' },
      red: { backgroundColor: variant === 'filled' ? '#e03131' : 'transparent', color: variant === 'filled' ? 'white' : '#e03131', borderColor: '#e03131' },
      gray: { backgroundColor: variant === 'filled' ? '#495057' : 'transparent', color: variant === 'filled' ? 'white' : '#495057', borderColor: '#495057' }
    };
    
    const defaultColor = { backgroundColor: variant === 'filled' ? '#228be6' : 'transparent', color: variant === 'filled' ? 'white' : '#228be6', borderColor: '#228be6' };
    const selectedColor = colorMap[color] || defaultColor;
    
    return {
      ...selectedColor,
      border: variant !== 'filled' ? `1px solid ${selectedColor.borderColor || selectedColor.color}` : 'none',
    };
  };

  return (
    <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto', display: 'inline-block' }}>
      <button
        onMouseDown={startPressing}
        onMouseUp={stopPressing}
        onMouseLeave={stopPressing}
        onTouchStart={startPressing}
        onTouchEnd={stopPressing}
        onTouchCancel={stopPressing}
        style={{
          ...sizeStyles[size || 'md'],
          ...getButtonStyles(),
          borderRadius: '4px',
          cursor: 'pointer',
          width: fullWidth ? '100%' : 'auto',
          transition: 'background-color 0.2s',
          fontWeight: 500,
          ...buttonProps.style
        }}
        {...buttonProps}
      >
        {children}
      </button>
      {pressing && (
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            backgroundColor: '#e9ecef',
            borderRadius: '0 0 4px 4px',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: color === 'green' ? '#2b8a3e' : 
                              color === 'red' ? '#e03131' : 
                              color === 'gray' ? '#495057' : '#228be6',
              transition: 'width 0.01s linear'
            }}
          />
        </div>
      )}
    </div>
  );
}