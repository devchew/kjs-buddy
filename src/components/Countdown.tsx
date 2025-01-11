import { FunctionComponent, useEffect, useState } from 'react';
import './Countdown.css';
import AnimatedNumber from "react-awesome-animated-number";
import "react-awesome-animated-number/dist/index.css"
import { msToSeparateValues, separateValuesToMs } from '../helpers/timeParsers.tsx';
import { useCardContext } from '../contexts/CardContext.tsx';

const getNowAsMsFrommidnight = () => {
    const now = new Date();
    return separateValuesToMs([now.getHours(), now.getMinutes(), now.getSeconds(), 0]);
}

export const Countdown: FunctionComponent = () => {
    const [until, setUntil] = useState(0);
    const { countdown } = useCardContext();


    useEffect(() => {
        const interval = setInterval(() => {
            setUntil(countdown.toTime - getNowAsMsFrommidnight());
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown]);

    if (until <= 0) {
        return null;
    }

    const [
        hours,
        minutes,
        seconds
    ] = msToSeparateValues(until);

    return (<div className="countdown">
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
    )
}
