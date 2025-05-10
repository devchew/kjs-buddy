import "./TimePicker.css";
import { type FunctionComponent } from 'react';
type Props = {
    title?: string;
    subtitle?: string;
    value: number;
    precision: "hours" | "minutes" | "seconds" | "miliseconds" | "milisecondsWithoutHours";
    disabled?: boolean;
    style?: 'normal' | 'gray';
    className?: string;
    onChange: (value: number) => void;
};
export declare const TimePicker: FunctionComponent<Props>;
export {};
