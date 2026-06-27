import { describe, it, expect } from 'vitest';
import { cx, range, clamp, initials, slugify } from './index';

describe('utils', () => {
  it('cx joins truthy fragments', () => {
    expect(cx('a', false, 'b', undefined, null, 'c')).toBe('a b c');
  });
  it('range builds 0..n-1', () => {
    expect(range(3)).toEqual([0, 1, 2]);
  });
  it('clamp bounds values', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
  });
  it('initials takes up to two leading letters', () => {
    expect(initials('Ada Lovelace')).toBe('AL');
    expect(initials('plataforma')).toBe('P');
  });
  it('slugify normalizes to url-safe', () => {
    expect(slugify('Minha Organização!')).toBe('minha-organizacao');
  });
});
