const roundToTwoDigits = (value) => parseInt(value.toPrecision(2), 10);
/**
 * Converts miliseconds to separate values: hours, minutes, seconds and miliseconds
 * @param ms
 * @returns [hours, minutes, seconds, miliseconds]
 */
export const msToSeparateValues = (ms) => {
    const hours = Math.floor((ms % 86400000) / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const miliseconds = roundToTwoDigits(ms % 1000);
    return [hours, minutes, seconds, miliseconds];
};
/**
 * Converts separate values: hours, minutes, seconds and miliseconds to miliseconds
 * @param values
 * @returns miliseconds
 */
export const separateValuesToMs = (values) => {
    const [hours, minutes, seconds, miliseconds] = values;
    return hours * 3600000 + minutes * 60000 + seconds * 1000 + miliseconds;
};
export const getNowAsMsFrommidnight = () => {
    const now = new Date();
    return separateValuesToMs([now.getHours(), now.getMinutes(), now.getSeconds(), 0]);
};
