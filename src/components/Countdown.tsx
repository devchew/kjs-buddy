import { FunctionComponent, useEffect, useState } from 'react';
import './Countdown.css';
import AnimatedNumber from "react-awesome-animated-number";
import "react-awesome-animated-number/dist/index.css"
import { msToSeparateValues, getNowAsMsFrommidnight } from '../helpers/timeParsers.ts';
import { useCardContext } from '../contexts/CardContext.tsx';
import { gradientColorBasedOnTime } from '../helpers/gradientColorBasedOnTime.ts';

export const Countdown: FunctionComponent = () => {
    const [until, setUntil] = useState(0);
    const { countdown } = useCardContext();


    useEffect(() => {
        const interval = setInterval(() => {
            setUntil(countdown.toTime - getNowAsMsFrommidnight());
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown]);

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
        <div className="bottomStrip" style={{ backgroundColor: gradientColorBasedOnTime(until) }}>
            <span className="bottomStrip__message">
                {countdown.message}
            </span>
            <div className="countdown">
                <span className="countdown__value">
                    {hours && <AnimatedNumber size={40} value={hours} minDigits={2}  />}
                </span>
                :
                <span className="countdown__value">
                    {minutes && <AnimatedNumber size={40} value={minutes} minDigits={2} />}
                </span>
                :
                <span className="countdown__value">
                    {seconds && <AnimatedNumber size={40} value={seconds} minDigits={2} />}
                </span>
            </div>
        </div>
    )
}
