import { useWakeLock } from '../hooks/useWakeLock.ts';
import './WakeLock.css';

export const WakeLock = () => {
    const {wakeLockError, wakeLockActive, toggleWakeLock} = useWakeLock();

    return (
        <div className="wakeLock">
            {wakeLockError && <div className="wakeLock__error">{wakeLockError}</div>}
            <fieldset className="wakeLock__fieldset">
                <label>pozostaw ekran aktywny
                    <input type="checkbox" checked={wakeLockActive} onChange={() => toggleWakeLock()} />
                </label>
            </fieldset>
        </div>
    )
}
