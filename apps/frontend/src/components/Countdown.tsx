import { FunctionComponent, useEffect, useState } from 'react';
import './Countdown.css';
import AnimatedNumber from "react-awesome-animated-number";
import "react-awesome-animated-number/dist/index.css"
import { msToSeparateValues, getNowAsMsFrommidnight } from '../helpers/timeParsers.ts';
import { useCardContext } from '@internal/rally-card';
import { gradientColorBasedOnTime } from '../helpers/gradientColorBasedOnTime.ts';
import { useNavigate, useMatch } from 'react-router-dom';
import type { Countdown as CountdownType } from '../types/Countdown.ts';
import { useBroadcast } from '../hooks/useBroadcast.ts';

export const Countdown: FunctionComponent = () => {
    const { subscribe }  = useBroadcast();
    const isOnCardPage = useMatch('/cards/:id');
    const navigate = useNavigate();
    const [until, setUntil] = useState(0);
    const [countdown, setCountdown] = useState<CountdownType>({toTime: 0, message: ''});
    const { id } = useCardContext();

    useEffect(() => {
        const interval = setInterval(() => {
            setUntil(countdown.toTime - getNowAsMsFrommidnight());
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown]);

    useEffect(() => {
        subscribe('countdown', (data) => {
            console.log('countdown recived', data);
            setCountdown(data);
        });
    }, [subscribe]);

    if (countdown.toTime === 0 && countdown.message === '') {
        return null;
    }

    // keep the countdown for 5 minutes after it has passed
    if (until <= -300000) {
        return null;
    }

    const [
        hours,
        minutes,
        seconds
    ] = until > 0 ? msToSeparateValues(until) : [0, 0, 0];


    return (
        <div
          onClick={isOnCardPage ? undefined : () => navigate(`/cards/${id}`)}
          style={{
            backgroundColor: gradientColorBasedOnTime(until),
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '100%',
            maxWidth: '550px',
            cursor: isOnCardPage ? 'default' : 'pointer',
          color: 'white'
          }}
        >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
                <span style={{
                  fontWeight: 600,

                }}>
                    {countdown.message}
                </span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div className="countdown__value">
                        {hours && <AnimatedNumber size={40} value={hours} minDigits={2} />}
                    </div>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}>:</span>
                    <div className="countdown__value">
                        {minutes && <AnimatedNumber size={40} value={minutes} minDigits={2} />}
                    </div>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                    }}>:</span>
                    <div className="countdown__value">
                        {seconds && <AnimatedNumber size={40} value={seconds} minDigits={2} />}
                    </div>
                </div>
            </div>
        </div>
    )
}
