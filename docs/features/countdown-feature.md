# Countdown Feature

## Overview

The Countdown feature is a core component of KJS Buddy that provides real-time timing information for rally events. It calculates the time remaining until the next time control point (PKC) and sends notifications at predefined intervals, ensuring competitors never miss their scheduled arrival times.

![Countdown Demo](../countdown.gif)

## Implementation Architecture

The Countdown feature is implemented through a combination of several components:

1. **Countdown Calculator**: Determines the next checkpoint and remaining time
2. **Web Worker**: Manages timers and notifications in the background
3. **Message Passing System**: Enables communication between threads
4. **Notification System**: Delivers alerts to users

## Countdown Calculation

The countdown calculation logic identifies the next upcoming time control point and calculates the time remaining:

```typescript
// From calculateCountdown.ts
import { CardPanel } from "../types/Card.ts";
import { Countdown } from "../types/Countdown.ts";
import { getNowAsMsFrommidnight } from "./timeParsers.ts";

const findClosestPanel = (panels: CardPanel[]): CardPanel | undefined => {
  const now = getNowAsMsFrommidnight();
  return panels.find((panel) => panel.arrivalTime - now > 0);
};

export const calculateCountdown = (panels: CardPanel[]): Countdown => {
  const closestPanel = findClosestPanel(panels);
  if (closestPanel) {
    return {
      toTime: closestPanel.arrivalTime,
      message: `staw się na PKC${closestPanel.number}`,
    };
  }
  return { toTime: 0, message: "" };
};
```

This logic:
1. Gets the current time as milliseconds from midnight
2. Finds the first panel with an arrival time in the future
3. Creates a countdown object with the target time and notification message
4. Returns a default object if no future panels are found

## Time Parsing Utilities

Accurate time calculations are essential for the countdown feature. KJS Buddy includes specialized time parsing utilities:

```typescript
// From timeParsers.ts
export const getNowAsMsFrommidnight = (): number => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  
  return now.getTime() - midnight.getTime();
};

export const msToTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
};

export const timeToMs = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
};
```

These utilities convert between different time formats and ensure consistent timing calculations across the application.

## Countdown Context

The countdown state is managed through a dedicated React context:

```typescript
// Example countdown context implementation
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Countdown } from '../types/Countdown';
import { msToTime } from '../helpers/timeParsers';

interface CountdownContextType {
  countdown: Countdown | null;
  formattedTime: string;
  percentage: number;
}

const CountdownContext = createContext<CountdownContextType>({
  countdown: null,
  formattedTime: '00:00:00',
  percentage: 0,
});

export const useCountdown = () => useContext(CountdownContext);

export const CountdownProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [formattedTime, setFormattedTime] = useState('00:00:00');
  const [percentage, setPercentage] = useState(0);
  
  // Listen for countdown updates from service worker
  useEffect(() => {
    const channel = new BroadcastChannel('sw-messages');
    
    channel.addEventListener('message', (event) => {
      if (event.data.id === 'countdown') {
        setCountdown(event.data.data);
      }
    });
    
    return () => {
      channel.close();
    };
  }, []);
  
  // Update formatted time and percentage
  useEffect(() => {
    if (!countdown || countdown.toTime === 0) {
      setFormattedTime('00:00:00');
      setPercentage(0);
      return;
    }
    
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(0, 0, 0, 0);
      
      const currentMs = now.getTime() - midnight.getTime();
      const remaining = countdown.toTime - currentMs;
      
      if (remaining <= 0) {
        setFormattedTime('00:00:00');
        setPercentage(100);
        return;
      }
      
      // Format remaining time
      setFormattedTime(msToTime(remaining));
      
      // Calculate percentage for visual indicator
      // Assuming 15 minutes is the full range for percentage calculation
      const fullRange = 15 * 60 * 1000; // 15 minutes in ms
      const progress = Math.max(0, Math.min(100, 100 - (remaining / fullRange) * 100));
      setPercentage(progress);
    };
    
    // Update immediately
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [countdown]);
  
  return (
    <CountdownContext.Provider value={{ countdown, formattedTime, percentage }}>
      {children}
    </CountdownContext.Provider>
  );
};
```

This context:
1. Listens for countdown updates from the service worker
2. Formats the remaining time in a human-readable format
3. Calculates a percentage for visual indicators
4. Updates the countdown display every second

## Service Worker Integration

The service worker plays a crucial role in the countdown feature, managing timers and notifications even when the application is in the background:

```typescript
// From sw.ts (service worker file)
let countdown5MinNotifyTimer: number | undefined;
let countdown1MinNotifyTimer: number | undefined;

const updateCountdownNotify = (countdown: Countdown) => {
  clearTimeout(countdown5MinNotifyTimer);
  clearTimeout(countdown1MinNotifyTimer);
  if (countdown.toTime === 0 && countdown.message === "") {
    return;
  }

  // 5 minutes before the countdown, send a notification
  const when5 = countdown.toTime - getNowAsMsFrommidnight() - 300000;
  // 1 minute before the countdown, send a notification
  const when1 = countdown.toTime - getNowAsMsFrommidnight() - 60000;

  if (when5 > 0) {
    countdown5MinNotifyTimer = setTimeout(() => {
      sendNotification("PKC 5 minut!", countdown.message);
    }, when5);
  }

  if (when1 > 0) {
    countdown1MinNotifyTimer = setTimeout(() => {
      sendNotification("PKC 1 minuta", countdown.message);
    }, when1);
  }
};

// Notification function
const sendNotification = async (title: string, body: string) => {
  await self.registration.showNotification(title, {
    body,
    tag: "vibration-sample",
  });
};
```

This implementation:
1. Clears any existing notification timers when receiving new countdown data
2. Calculates the exact times for 5-minute and 1-minute notifications
3. Sets up new timers for these notification points
4. Sends notifications at the appropriate times using the Service Worker API

## Message Passing System

KJS Buddy uses a broadcast channel for communication between the main thread and service worker:

```typescript
// From broadcastHelpers.ts
import { Messages } from "../types/Messages.ts";

export type OnMessage = <K extends keyof Messages>(
  event: MessageEvent,
  message: K,
  callback: (data: Messages[K]) => void,
) => void;

export const onBroadcastMessage: OnMessage = (event, name, callback) => {
  if (event.data.id === name) {
    callback(event.data.data);
  }
};

export type PostMessage = (
  channel: BroadcastChannel,
) => <K extends keyof Messages>(message: K, data: Messages[K]) => void;

export const postBroadcastMessage: PostMessage =
  (channel) => (message, data) => {
    channel.postMessage({ id: message, data });
  };
```

This system:
1. Provides type-safe message passing between threads
2. Facilitates specific message handling with callback functions
3. Creates a standardized format for message data

## Event Handling in Service Worker

The service worker listens for panel updates and calculates the countdown:

```typescript
// In service worker
const channel = new BroadcastChannel("sw-messages");
const postMessage = postBroadcastMessage(channel);

channel.addEventListener("message", (event) => {
  onBroadcastMessage(event, "panels", (data) => {
    const countdown = calculateCountdown(data);
    updateCountdownNotify(countdown);
    postMessage("countdown", countdown);
  });

  onBroadcastMessage(event, "notifiyTest", (data) => {
    sendNotification("Test", data).then((r) =>
      console.log("Notification sent", r),
    );
  });
});
```

When panel data is received:
1. The countdown is calculated based on the latest panel information
2. Notification timers are updated
3. The countdown information is broadcast back to the application

## UI Components

The countdown feature includes several UI components for displaying timing information:

### Countdown Display

```tsx
// Example countdown display component
import React from 'react';
import { useCountdown } from '../contexts/CountdownContext';
import './CountdownDisplay.css';

export const CountdownDisplay: React.FC = () => {
  const { formattedTime, percentage, countdown } = useCountdown();
  
  if (!countdown || countdown.toTime === 0) {
    return null;
  }
  
  return (
    <div className="countdown-container">
      <div className="countdown-message">{countdown.message}</div>
      <div className="countdown-time">{formattedTime}</div>
      <div className="countdown-progress-bar">
        <div 
          className="countdown-progress" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
};
```

### Countdown Timer Animation

The countdown display includes visual elements to indicate progress:

```css
/* Example CSS for countdown animation */
.countdown-container {
  position: relative;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.countdown-time {
  font-size: 2rem;
  font-weight: bold;
  font-family: monospace;
  text-align: center;
}

.countdown-message {
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.countdown-progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.countdown-progress {
  height: 100%;
  background: linear-gradient(to right, #4CAF50, #FFC107, #F44336);
  transition: width 1s linear;
}
```

## Notification System

The countdown feature leverages the browser's Notification API to alert users of upcoming time control points:

### Permission Handling

Before notifications can be sent, permission must be requested:

```typescript
// Example notification permission request
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Usage in a component
useEffect(() => {
  const setupNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    
    if (granted) {
      // Send test notification to ensure service worker is ready
      const channel = new BroadcastChannel('sw-messages');
      channel.postMessage({ 
        id: 'notifiyTest', 
        data: 'Testing notifications system' 
      });
      channel.close();
    }
  };
  
  setupNotifications();
}, []);
```

### Notification Types

The countdown feature includes several notification types:

1. **5-Minute Warning**: Alerts user that they need to be at the next time control in 5 minutes
2. **1-Minute Warning**: Final reminder that the time control is imminent
3. **Test Notification**: Confirms that the notification system is working correctly

## Using the Countdown Feature

### Triggering Countdown Updates

When card panels are updated, the countdown needs to be recalculated:

```tsx
// Example of updating countdown when panels change
import { useCardContext } from '@internal/rally-card';
import { useEffect } from 'react';

export const CountdownUpdater: React.FC = () => {
  const { panels } = useCardContext();
  
  useEffect(() => {
    if (panels.length === 0) return;
    
    // Send panels to service worker for countdown calculation
    const channel = new BroadcastChannel('sw-messages');
    channel.postMessage({ id: 'panels', data: panels });
    channel.close();
  }, [panels]);
  
  return null;
};
```

### Integrating with Card Context

The countdown feature needs to react to changes in the card data:

```tsx
// Example integration with card data
import { useCardContext } from '@internal/rally-card';
import { useEffect, useState } from 'react';

export const CardIntegration: React.FC = () => {
  const { panels, updatePanelByNumber } = useCardContext();
  const [activeCountdown, setActiveCountdown] = useState(false);
  
  // Listen for updates from service worker
  useEffect(() => {
    if (panels.length === 0) return;
    
    const channel = new BroadcastChannel('sw-messages');
    
    // Initial panel data to service worker
    channel.postMessage({ id: 'panels', data: panels });
    setActiveCountdown(true);
    
    // Listen for panel updates (e.g. from timer calculations)
    channel.addEventListener('message', (event) => {
      if (event.data.id === 'panel-update') {
        const updatedPanel = event.data.data;
        updatePanelByNumber(updatedPanel.number, updatedPanel);
      }
    });
    
    return () => {
      channel.close();
    };
  }, [panels.length]);
  
  return (
    <div className="card-status">
      {activeCountdown ? 
        <div className="active-countdown-indicator">Countdown Active</div> : 
        <div className="no-countdown-indicator">No Active Countdown</div>
      }
    </div>
  );
};
```

## Testing the Countdown

KJS Buddy includes utilities for testing the countdown feature:

```tsx
// Example countdown test component
export const CountdownTester: React.FC = () => {
  const [testMinutes, setTestMinutes] = useState(5);
  
  const simulateCountdown = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    
    const currentMs = now.getTime() - midnight.getTime();
    const testPanel = {
      number: 1,
      name: 'TEST',
      finishTime: 0,
      provisionalStartTime: 0,
      actualStartTime: 0,
      drivingTime: 0,
      resultTime: 0,
      nextPKCTime: 0,
      arrivalTime: currentMs + (testMinutes * 60 * 1000) // Current time + X minutes
    };
    
    const channel = new BroadcastChannel('sw-messages');
    channel.postMessage({ id: 'panels', data: [testPanel] });
    channel.close();
  };
  
  return (
    <div className="countdown-tester">
      <h3>Test Countdown Feature</h3>
      <div>
        <label>
          Minutes until next PKC:
          <input 
            type="number" 
            value={testMinutes} 
            onChange={e => setTestMinutes(Number(e.target.value))}
            min="1"
            max="60"
          />
        </label>
      </div>
      <button onClick={simulateCountdown}>Simulate Countdown</button>
    </div>
  );
};
```

## Edge Cases and Error Handling

The countdown feature includes handling for various edge cases:

### No Future Panels

```typescript
export const calculateCountdown = (panels: CardPanel[]): Countdown => {
  const closestPanel = findClosestPanel(panels);
  if (closestPanel) {
    return {
      toTime: closestPanel.arrivalTime,
      message: `staw się na PKC${closestPanel.number}`,
    };
  }
  // Default when no future panels are found
  return { toTime: 0, message: "" };
};
```

### Service Worker Not Available

```typescript
// Example fallback for environments without service worker
const useCountdownFallback = () => {
  const { panels } = useCardContext();
  const [countdown, setCountdown] = useState<Countdown | null>(null);
  
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      // Fallback implementation if service worker is not available
      const intervalId = setInterval(() => {
        const closestPanel = findClosestPanel(panels);
        if (closestPanel) {
          setCountdown({
            toTime: closestPanel.arrivalTime,
            message: `staw się na PKC${closestPanel.number}`,
          });
        } else {
          setCountdown({ toTime: 0, message: "" });
        }
      }, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [panels]);
  
  return countdown;
};
```

### Notification Permission Denied

```typescript
// Example handling for denied notification permissions
const NotificationSettings: React.FC = () => {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  
  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    
    const result = await Notification.requestPermission();
    setPermission(result);
  };
  
  return (
    <div className="notification-settings">
      <h3>Notification Settings</h3>
      
      {permission === 'unsupported' && (
        <p>Your browser does not support notifications.</p>
      )}
      
      {permission === 'denied' && (
        <div className="notification-warning">
          <p>Notifications are blocked. The countdown feature will not be able to alert you about upcoming time controls.</p>
          <p>Please update your browser settings to allow notifications for this site.</p>
        </div>
      )}
      
      {permission === 'default' && (
        <button onClick={requestPermission}>
          Enable Countdown Notifications
        </button>
      )}
      
      {permission === 'granted' && (
        <p>Countdown notifications are enabled.</p>
      )}
    </div>
  );
};
```

## Performance Optimizations

The countdown feature includes several optimizations to ensure efficient operation:

### Efficient Timer Management

```typescript
// Optimized timer management in service worker
const updateCountdownNotify = (countdown: Countdown) => {
  // Only clear and reset timers if the countdown has changed
  if (
    currentCountdown &&
    countdown.toTime === currentCountdown.toTime &&
    countdown.message === currentCountdown.message
  ) {
    return;
  }
  
  currentCountdown = countdown;
  
  clearTimeout(countdown5MinNotifyTimer);
  clearTimeout(countdown1MinNotifyTimer);
  
  if (countdown.toTime === 0 && countdown.message === "") {
    return;
  }

  // Calculate notification times
  const now = getNowAsMsFrommidnight();
  const when5 = countdown.toTime - now - 300000;
  const when1 = countdown.toTime - now - 60000;

  // Set up notifications only if they're in the future
  if (when5 > 0) {
    countdown5MinNotifyTimer = setTimeout(() => {
      sendNotification("PKC 5 minut!", countdown.message);
    }, when5);
  }

  if (when1 > 0) {
    countdown1MinNotifyTimer = setTimeout(() => {
      sendNotification("PKC 1 minuta", countdown.message);
    }, when1);
  }
};
```

### Minimizing Message Passing

```typescript
// Example of optimizing message passing
const sendPanelsToServiceWorker = (panels: CardPanel[]) => {
  // Only send relevant panel data for countdown calculation
  const simplifiedPanels = panels.map(panel => ({
    number: panel.number,
    arrivalTime: panel.arrivalTime
  }));
  
  const channel = new BroadcastChannel('sw-messages');
  channel.postMessage({ id: 'panels', data: simplifiedPanels });
  channel.close();
};
```

### Battery-Efficient Updates

```typescript
// Example of optimizing update frequency
useEffect(() => {
  let updateInterval: number;
  
  if (countdown && countdown.toTime > 0) {
    const now = getNowAsMsFrommidnight();
    const timeRemaining = countdown.toTime - now;
    
    // Adaptive update frequency based on remaining time
    if (timeRemaining > 10 * 60 * 1000) { // More than 10 minutes
      updateInterval = setInterval(updateDisplay, 10000); // Update every 10 seconds
    } else if (timeRemaining > 60 * 1000) { // 1-10 minutes
      updateInterval = setInterval(updateDisplay, 5000); // Update every 5 seconds
    } else { // Less than 1 minute
      updateInterval = setInterval(updateDisplay, 1000); // Update every second
    }
  }
  
  return () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  };
}, [countdown]);
```
