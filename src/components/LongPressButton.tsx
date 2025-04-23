import { FunctionComponent, ReactNode } from 'react';
import { useLongPress } from '../hooks/useLongPress';
import './ButtonAnimation.css';

type LongPressButtonProps = {
  onLongPress: () => void;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
};

export const LongPressButton: FunctionComponent<LongPressButtonProps> = ({
  onLongPress,
  onClick = () => {},
  children,
  className = '',
  delay = 800,
  style = {},
}) => {
  const { isHolding, progress, ...longPressHandlers } = useLongPress(
    onLongPress,
    onClick,
    { delay }
  );

  return (
    <button
      {...longPressHandlers}
      className={`button-with-progress ${className}`}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#1b3c83',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ...style
      }}
    >
      {children}
      {isHolding && (
        <div 
          className="button-progress-bar"
          style={{ width: `${progress}%` }}
        />
      )}
    </button>
  );
};