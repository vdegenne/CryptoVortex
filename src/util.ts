export async function wait (ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export function round(value: number, precision = 2) {
  return Math.round(value * (10 ** precision)) / (10 ** precision);
}