import { describe, it, expect } from 'vitest';
import { theme } from 'antd';
import { lightTheme, darkTheme, themeFor, tokens } from './index';

describe('brand-tokens', () => {
  it('derives the primary seed from the DTCG source', () => {
    expect(lightTheme.token?.colorPrimary).toBe('#0066CC');
    expect(darkTheme.token?.colorPrimary).toBe('#0066CC');
  });

  it('applies the correct algorithm per mode', () => {
    expect(lightTheme.algorithm).toBe(theme.defaultAlgorithm);
    expect(darkTheme.algorithm).toBe(theme.darkAlgorithm);
  });

  it('maps component tokens without leaking across components', () => {
    expect(lightTheme.components?.Button?.controlHeight).toBe(40);
    expect(lightTheme.components?.Button?.fontWeight).toBe(500);
  });

  it('flips background base between modes', () => {
    expect(lightTheme.token?.colorBgBase).toBe('#FFFFFF');
    expect(darkTheme.token?.colorBgBase).toBe('#141414');
  });

  it('exposes a flat token map for foundations docs', () => {
    expect(tokens['color.brand.primary']).toBe('#0066CC');
    expect(tokens['radius.base']).toBe(6);
  });

  it('resolves themes by mode', () => {
    expect(themeFor('light')).toBe(lightTheme);
    expect(themeFor('dark')).toBe(darkTheme);
  });
});
