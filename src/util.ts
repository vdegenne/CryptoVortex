export async function wait (ms: number) {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export function round(value: number, precision = 2) {
  return Math.round(value * (10 ** precision)) / (10 ** precision);
}

export function percent (a: number, b: number) {
  return 100 * (b - a) / a;
}

export function formatVolume(volume: number) {
  let divided = Math.round(volume / 1000000)
  if (divided >= 1) {
    return `${divided}M`;
  }
  divided = Math.round(volume / 1000);
  if (divided) {
    return `${divided}K`;
  }
  return Math.round(volume);
}