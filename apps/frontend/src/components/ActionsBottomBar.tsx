import { Alert, Box, Stack } from "@mantine/core";
import { AskNotificationBar } from "./AskNotificationBar";
import { Countdown } from "./Countdown";
import { WakeLock } from "./WakeLock";
import { useOffline } from "../hooks/offline";
import { useCardContext } from "../contexts/CardContext";

export const ActionsBottomBar = () => {
    const isOffline = useOffline();
    const { id } = useCardContext();
    return (
      <Box mt={90}>
          <Stack p="md" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
          {isOffline && (
                    <Alert color="red" radius="md" title="Offline">
                      Brak połączenia z internetem
                    </Alert>
                  )}
                  
                  <Box>
                    <AskNotificationBar />
                    <WakeLock />
                    {id && (<Countdown />)}
                  </Box>
          </Stack>
      </Box>
    )
};