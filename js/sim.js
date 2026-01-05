export function simulateOnce() {
  // 50-50 win/loss
  const win = Math.random() < 0.5;
  return win
    ? { outcome: "win", multiplier: 1.3 }
    : { outcome: "loss", multiplier: 0.9 };
}
