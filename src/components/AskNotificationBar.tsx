import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import './AskNotificationBar.css';

const useNotificationPermision = () => {
    const [granted, setGranted] = useState(false);
    const [unsupported, setUnsupported] = useState(false);

    useEffect(() => {
        setGranted(false);
        setUnsupported(false);

        if (!("Notification" in window)) {
            setUnsupported(true);
            setGranted(false);
            return;
        }

        if (Notification.permission === "granted") {
            setGranted(true);
            return;
        }

        setGranted(false);
    }, []);

    const askNotificationPermission = useCallback(() => {
        if (unsupported || granted) {
            return;
        }

        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                setGranted(true);
            }
        });

    }, [unsupported, granted]);


    return { granted, unsupported, askNotificationPermission };
}


export const AskNotificationBar: FunctionComponent = () => {
    const { askNotificationPermission, granted, unsupported } = useNotificationPermision();
    const [hidden, setHidden] = useState(false);

    if (unsupported || granted || hidden) {
        return null;
    }

    return (
        <div className="askNotificationBar">
            <button onClick={askNotificationPermission} className="askNotificationBar__action">Zezwól na powiadomienia</button>
            <p>
                Wyślemy Ci powiadomienie, gdy zbliża się czas na kolejne PKC.
            </p>
            <button onClick={() => setHidden(true)} className="askNotificationBar__dismiss">Zamknij</button>
        </div>
    );
}
