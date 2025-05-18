/**
 * Fluid transition from green (#06d6a0) to red (#ef476f) through yellow (#ffd166)
 * based on the time left (in ms).
 *
 * - If time >= 30 minutes: color is green (#06d6a0)
 * - If time <= 1 minute: color is red (#ef476f)
 * - If 5 minutes <= time < 30 minutes: color transitions from yellow (#ffd166) to green
 * - If 1 minute < time < 5 minutes: color transitions from red (#ef476f) to yellow (#ffd166)
 *
 * @param time - The time left in milliseconds.
 * @returns A CSS color string (e.g., "rgb(255, 0, 0)" or "#ffd166").
 */
export const gradientColorBasedOnTime = (time: number): string => {
  // 1 min, 5 min, 30 min in ms
  const ONE_MIN = 60_000;
  const FIVE_MIN = 5 * 60_000;
  const THIRTY_MIN = 30 * 60_000;

  // Named colors (hex to RGB):
  const green = [0x06, 0xd6, 0xa0]; // #06d6a0
  const red = [0xef, 0x47, 0x6f]; // #ef476f
  const yellow = [0xff, 0xd1, 0x66]; // #ffd166

  // Helper: linearly interpolate between two RGB values
  const lerpColor = (c1: number[], c2: number[], t: number): string => {
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // 1) If time >= 30 minutes => green
  if (time >= THIRTY_MIN) {
    return "#06d6a0";
  }

  // 2) If time <= 1 minute => red
  if (time <= ONE_MIN) {
    return "#ef476f";
  }

  // 3) Between 1 min and 5 min => transition from red to yellow
  if (time < FIVE_MIN) {
    // time = 1 min => ratio = 0 => red
    // time = 5 min => ratio = 1 => yellow
    const ratio = (time - ONE_MIN) / (FIVE_MIN - ONE_MIN);
    return lerpColor(red, yellow, ratio);
  }

  // 4) Between 5 min and 30 min => transition from yellow to green
  // time = 5 min => ratio = 0 => yellow
  // time = 30 min => ratio = 1 => green
  const ratio = (time - FIVE_MIN) / (THIRTY_MIN - FIVE_MIN);
  return lerpColor(yellow, green, ratio);
};
