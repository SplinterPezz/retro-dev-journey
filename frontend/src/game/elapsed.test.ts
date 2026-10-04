import { formatElapsed } from './elapsed';

describe('formatElapsed', () => {
  it('writes minutes, seconds and hundredths like a timed race', () => {
    expect(formatElapsed((15 * 60 + 30) * 1000 + 200)).toBe("15'30,20");
    expect(formatElapsed(0)).toBe("0'00,00");
  });

  it('puts the hours in front once there is one', () => {
    expect(formatElapsed(((1 * 60 + 5) * 60 + 7) * 1000 + 90)).toBe("1'05'07,09");
  });
});
