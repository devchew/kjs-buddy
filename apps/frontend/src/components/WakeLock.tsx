import { useWakeLock } from '../hooks/useWakeLock.ts';
import { TbScreenShare } from 'react-icons/tb';

export const WakeLock = () => {
    const {wakeLockError, wakeLockActive, toggleWakeLock} = useWakeLock();

    return (
        <div style={{ marginBottom: '1rem' }}>
            {wakeLockError && (
                <div style={{ 
                    backgroundColor: '#fee', 
                    color: '#c53030',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    border: '1px solid #fcc'
                }}>
                    <strong>Wake Lock Error: </strong>
                    {wakeLockError}
                </div>
            )}
            <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}>
                <div style={{ 
                    position: 'relative',
                    width: '36px',
                    height: '20px'
                }}>
                    <input
                        type="checkbox"
                        checked={wakeLockActive}
                        onChange={() => toggleWakeLock()}
                        style={{ 
                            opacity: 0,
                            width: 0,
                            height: 0,
                            position: 'absolute'
                        }}
                    />
                    <span style={{ 
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: wakeLockActive ? '#339af0' : '#e9ecef',
                        borderRadius: '34px',
                        transition: 'background-color 0.4s'
                    }}>
                        <span style={{
                            position: 'absolute',
                            content: '',
                            height: '16px',
                            width: '16px',
                            left: wakeLockActive ? '16px' : '2px',
                            bottom: '2px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: 'left 0.4s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TbScreenShare 
                                size={14} 
                                color={wakeLockActive ? '#339af0' : 'gray'} 
                                style={{ position: 'absolute' }}
                            />
                        </span>
                    </span>
                </div>
                <span>Pozostaw ekran aktywny</span>
            </label>
        </div>
    )
}
