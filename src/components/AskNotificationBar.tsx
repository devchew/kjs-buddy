import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { 
  Alert, 
  Button, 
  Text
} from '@mantine/core';
import { TbBellRinging } from 'react-icons/tb';

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
        <Alert 
          color="blue" 
          radius="md" 
          title="Powiadomienia" 
          icon={<TbBellRinging />}
          withCloseButton
          onClose={() => setHidden(true)}
          mb="md"
        >
          <Text mb="md">
            Wyślemy Ci powiadomienie, gdy zbliża się czas na kolejne PKC.
          </Text>
          <Button 
            onClick={askNotificationPermission}
            size="sm"
            variant="filled"
          >
            Zezwól na powiadomienia
          </Button>
        </Alert>
    );
}
