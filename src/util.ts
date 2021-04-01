export async function wait (ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export function round(value: number, precision = 2) {
  return Math.round(value * (10 ** precision)) / (10 ** precision);
}

export function getMaximalAscent (open: number, high: number) {
  return 100 * (high - open) / open;
}

export function getMaximalDescent (open: number, low: number) {
  return 100 * (open - low) / open;
}