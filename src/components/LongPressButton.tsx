import { FunctionComponent, ReactNode, CSSProperties } from 'react';
import { useLongPress } from '../hooks/useLongPress';
import styles from './LongPressButton.module.css';

type LongPressButtonProps = {
  onLongPress: () => void;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  render?: (handlers: any) => ReactNode;
};

export const LongPressButton: FunctionComponent<LongPressButtonProps> = ({
  onLongPress,
  onClick = () => {},
  children,
  className = '',
  delay = 800,
  style = {},
  render,
}) => {
  const { isHolding, progress, ...longPressHandlers } = useLongPress(
    onLongPress,
    onClick,
    { delay }
  );

  const progressBarStyle = {
    '--progress-width': `${progress}%`
  } as CSSProperties;

  // If render prop is provided, use it
  if (render) {
    return (
      <>
        {render({
          ...longPressHandlers,
          className: `${styles.buttonWithProgress} ${className}`,
          style,
          children: (
            <>
              {children}
              {isHolding && (
                <div className={styles.progressBar} style={progressBarStyle} />
              )}
            </>
          )
        })}
      </>
    );
  }

  // Default button rendering
  return (
    <button
      {...longPressHandlers}
      className={`${styles.defaultButton} ${styles.buttonWithProgress} ${className}`}
      style={style}
    >
      {children}
      {isHolding && (
        <div className={styles.progressBar} style={progressBarStyle} />
      )}
    </button>
  );
};