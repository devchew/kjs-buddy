import "./TimePicker.css";
import { FunctionComponent, useEffect, useState } from 'react';
import { msToSeparateValues } from '../helpers/timeParsers.ts';


type TimePickerValueProps = {
    label: string,
    value: number,
    onChange: (value: number) => void,
    disabled?: boolean,
    emptyState?: boolean,
    max?: number,
    style?: 'normal' | 'gray';
};

const patternNumberTwoDigits = "[0-9]{1,2}";

const validate = (value: string, max: number = 99): number => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) {
        return 0;
    }
    return Math.min(parsed, max);
}

const TimePickerValue: FunctionComponent<TimePickerValueProps> = (
    {
        label,
        value,
        onChange,
        disabled,
        emptyState,
        max,
        style
    }) => {

    const [val, setVal] = useState(emptyState ? '' : value.toString());

    useEffect(() => {
        setVal(emptyState ? '' : value.toString());
    }, [emptyState, value]);

    const onBlur = () => {
        const validatedValue = validate(val, max);
        onChange(validatedValue);
        setVal(validatedValue.toString());
    }

    return (
        <div className={["timePickerValue", "timePickerValue--" + (style || 'normal')].join(" ")}>
            {label && <span className="timePickerValue__label">{label}</span>}
            <input
                type="number"
                className="timePickerValue__input"
                value={val}
                pattern={patternNumberTwoDigits}
                disabled={disabled}
                onFocus={(e) => e.target.select()}
                onBlur={onBlur}
                onChange={(e) => setVal(e.target?.value)}
            />
        </div>
    );
}


type Props = {
    title?: string;
    subtitle?: string;
    value: number; // in miliseconds
    precision: "hours" | "minutes" | "seconds" | "miliseconds" | "milisecondsWithoutHours";
    disabled?: boolean;
    style?: 'normal' | 'gray';
    className?: string;
    onChange: (value: number) => void;
}

const precisionToFlags = (precision: Props['precision']) => {
    switch (precision) {
        case "hours": return [true, false, false, false];
        case "minutes": return [true, true, false, false];
        case "seconds": return [true, true, true, false];
        case "miliseconds": return [true, true, true, true];
        case "milisecondsWithoutHours": return [false, true, true, true];
    }
}

export const TimePicker: FunctionComponent<Props> = (
    {
        title,
        subtitle,
        value,
        precision,
        disabled,
        className,
        style,
        onChange
    }
) => {

    const [showHours, showMinutes, showSeconds, showMiliseconds] = precisionToFlags(precision);
    const values = msToSeparateValues(value);
    const [hours, setHours] = useState(values[0]);
    const [minutes, setMinutes] = useState(values[1]);
    const [seconds, setSeconds] = useState(values[2]);
    const [miliseconds, setMiliseconds] = useState(values[3]);

    useEffect(() => {
        onChange && onChange(hours * 3600000 + minutes * 60000 + seconds * 1000 + miliseconds);
    }, [hours, minutes, seconds, miliseconds]);

    useEffect(() => {
        const values = msToSeparateValues(value);
        setHours(values[0]);
        setMinutes(values[1]);
        setSeconds(values[2]);
        setMiliseconds(values[3]);
    }, [value]);

    return (
        <div className={["timePicker", className].join(' ')}>
            {title && <span className="timePicker__title">{title}</span>}
            <div className="timePicker__values">
                {showHours && <TimePickerValue
                    value={hours}
                    label="H"
                    onChange={setHours}
                    disabled={disabled}
                    style={style}
                    emptyState={value === 0}
                    max={23}
                /> }
                {showMinutes && <TimePickerValue
                    value={minutes}
                    label="M"
                    onChange={setMinutes}
                    disabled={disabled}
                    style={style}
                    emptyState={value === 0}
                    max={59}
                /> }
                {showSeconds && <TimePickerValue
                    value={seconds}
                    label="S"
                    onChange={setSeconds}
                    disabled={disabled}
                    style={style}
                    emptyState={value === 0}
                    max={59}
                /> }
                {showMiliseconds && <TimePickerValue
                    value={miliseconds}
                    label="1/10"
                    onChange={setMiliseconds}
                    disabled={disabled}
                    style={style}
                    emptyState={value === 0}
                    max={99}
                /> }
            </div>
            {subtitle && <span className="timePicker__subtitle">{subtitle}</span>}
        </div>
    )

}
