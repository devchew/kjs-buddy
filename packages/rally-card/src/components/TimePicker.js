import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./TimePicker.css";
import { useEffect, useState } from 'react';
import { msToSeparateValues } from '../helpers/timeParsers.ts';
const patternNumberTwoDigits = "[0-9]{1,2}";
const validate = (value, max = 99) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed) || parsed < 0) {
        return 0;
    }
    return Math.min(parsed, max);
};
const TimePickerValue = ({ label, value, onChange, disabled, emptyState, max, style }) => {
    const [val, setVal] = useState(emptyState ? '' : value.toString(10));
    useEffect(() => {
        if (emptyState) {
            setVal('--');
            return;
        }
        if (value !== undefined && value !== null) {
            setVal(value.toString(10));
        }
    }, [emptyState, value]);
    const onBlur = () => {
        const validatedValue = validate(val, max);
        onChange(validatedValue);
        setVal(validatedValue.toString(10));
    };
    return (_jsxs("div", { className: ["timePickerValue", "timePickerValue--" + (style || 'normal')].join(" "), children: [label && _jsx("span", { className: "timePickerValue__label", children: label }), _jsx("input", { type: "text", inputMode: "numeric", autoComplete: "off", autoCorrect: "off", datatype: "number", className: "timePickerValue__input", value: val, onFocus: (e) => e.target.select(), pattern: patternNumberTwoDigits, disabled: disabled, onBlur: onBlur, onChange: (e) => setVal(e.target?.value), "aria-label": "TimePickerValue" })] }));
};
const precisionToFlags = (precision) => {
    switch (precision) {
        case "hours": return [true, false, false, false];
        case "minutes": return [true, true, false, false];
        case "seconds": return [true, true, true, false];
        case "miliseconds": return [true, true, true, true];
        case "milisecondsWithoutHours": return [false, true, true, true];
    }
};
export const TimePicker = ({ title, subtitle, value, precision, disabled, className, style, onChange }) => {
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
    return (_jsxs("div", { className: ["timePicker", className].join(' '), children: [title && _jsx("span", { className: "timePicker__title", children: title }), _jsxs("div", { className: "timePicker__values", children: [showHours && _jsx(TimePickerValue, { value: hours, label: "H", onChange: setHours, disabled: disabled, style: style, emptyState: value === 0, max: 23 }), showMinutes && _jsx(TimePickerValue, { value: minutes, label: "M", onChange: setMinutes, disabled: disabled, style: style, emptyState: value === 0, max: 59 }), showSeconds && _jsx(TimePickerValue, { value: seconds, label: "S", onChange: setSeconds, disabled: disabled, style: style, emptyState: value === 0, max: 59 }), showMiliseconds && _jsx(TimePickerValue, { value: miliseconds, label: "1/10", onChange: setMiliseconds, disabled: disabled, style: style, emptyState: value === 0, max: 99 })] }), subtitle && _jsx("span", { className: "timePicker__subtitle", children: subtitle })] }));
};
