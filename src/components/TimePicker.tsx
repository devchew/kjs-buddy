import "./TimePicker.css";
import { FunctionComponent } from 'react';


type TimePickerValueProps = {
    label: string,
    value: number,
    onChange: (value: number) => void,
    disabled?: boolean,
    style?: 'normal' | 'gray';
};

const TimePickerValue: FunctionComponent<TimePickerValueProps> = (
    {
        label,
        value,
        onChange,
        disabled,
        style
    }) =>
    (
        <div className={["timePickerValue", "timePickerValue--" + (style || 'normal')].join(" ")}>
            {label && <span className="timePickerValue__label">{label}</span>}
            <input
                type="number"
                className="timePickerValue__input"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(parseInt(e.target.value))}
            />
        </div>
    )


type Props = {
    title?: string;
    subtitle?: string;
    value: number; // in miliseconds
    precision: "hours" | "minutes" | "seconds" | "miliseconds" | "milisecondsWithoutHours";
    disabled?: boolean;
    style?: 'normal' | 'gray';
    className?: string;
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

const roundToTwoDigits = (value: number) => parseInt(value.toPrecision(2), 10);

const msToSeparateValues = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const miliseconds = roundToTwoDigits(ms % 1000);
    return [hours, minutes, seconds, miliseconds];
}

export const TimePicker: FunctionComponent<Props> = (
    {
        title,
        subtitle,
        value,
        precision,
        disabled,
        className,
        style
    }
) => {

    const [showHours, showMinutes, showSeconds, showMiliseconds] = precisionToFlags(precision);
    const [hours, minutes, seconds, miliseconds] = msToSeparateValues(value);
    return (
        <div className={["timePicker", className].join(' ')}>
            {title && <span className="timePicker__title">{title}</span>}
            <div className="timePicker__values">
                {showHours && <TimePickerValue
                    value={hours}
                    label="H"
                    onChange={console.log}
                    disabled={disabled}
                    style={style}
                /> }
                {showMinutes && <TimePickerValue
                    value={minutes}
                    label="M"
                    onChange={console.log}
                    disabled={disabled}
                    style={style}
                /> }
                {showSeconds && <TimePickerValue
                    value={seconds}
                    label="S"
                    onChange={console.log}
                    disabled={disabled}
                    style={style}
                /> }
                {showMiliseconds && <TimePickerValue
                    value={miliseconds}
                    label="1/10"
                    onChange={console.log}
                    disabled={disabled}
                    style={style}
                /> }
            </div>
            {subtitle && <span className="timePicker__subtitle">{subtitle}</span>}
        </div>
    )

}
