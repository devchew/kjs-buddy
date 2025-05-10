import { AskNotificationBar } from "./AskNotificationBar";
import { Countdown } from "./Countdown";
import { WakeLock } from "./WakeLock";
import { useOffline } from "../hooks/offline";

export const ActionsBottomBar = () => {
    const isOffline = useOffline();
    return (
      <div style={{ marginTop: '90px' }}>
          <div style={{
            padding: '16px',
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
          {isOffline && (
            <div style={{
              backgroundColor: '#ffeded',
              color: '#c53030',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #f56565'
            }}>
              <strong>Offline: </strong>
              Brak połączenia z internetem
            </div>
          )}

          <div>
            <AskNotificationBar />
            <Countdown />
          </div>
          </div>
      </div>
    )
};
