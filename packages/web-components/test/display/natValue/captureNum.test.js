// @ts-check
import '../../installSesLockdown.js';
import { describe, expect, it } from 'vitest';
import { captureNum } from '../../../src/display/natValue/helpers/captureNum.ts';

describe(captureNum, () => {
  it('can capture positive numbers', () => {
    expect(captureNum('200')).toEqual({ left: '200', right: '' });
    expect(captureNum('200.00')).toEqual({ left: '200', right: '00' });
    expect(captureNum('0200.00')).toEqual({ left: '0200', right: '00' });
    expect(captureNum('200.020')).toEqual({ left: '200', right: '020' });
  });

  it('throws on negative numbers', () => {
    expect(() => captureNum('-200')).toThrowError(
      /.* must be a non-negative decimal number/,
    );
    expect(() => captureNum('-200.00')).toThrowError(
      /.* must be a non-negative decimal number/,
    );
    expect(() => captureNum('-0200.00')).toThrowError(
      /.* must be a non-negative decimal number/,
    );
    expect(() => captureNum('-200.020')).toThrowError(
      /.* must be a non-negative decimal number/,
    );
  });

  it('throws on non-numbers', () => {
    expect(() => captureNum('a')).toThrowError(
      /.* must be a non-negative decimal number/,
    );
    expect(() => captureNum({})).toThrowError(
      /.* must be a non-negative decimal number/,
    );
  });
});
