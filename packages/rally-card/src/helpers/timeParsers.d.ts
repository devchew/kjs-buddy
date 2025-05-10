/**
 * Converts miliseconds to separate values: hours, minutes, seconds and miliseconds
 * @param ms
 * @returns [hours, minutes, seconds, miliseconds]
 */
export declare const msToSeparateValues: (ms: number) => number[];
/**
 * Converts separate values: hours, minutes, seconds and miliseconds to miliseconds
 * @param values
 * @returns miliseconds
 */
export declare const separateValuesToMs: (values: [number, number, number, number]) => number;
export declare const getNowAsMsFrommidnight: () => number;
