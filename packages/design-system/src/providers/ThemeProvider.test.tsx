import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from 'antd';
import { ThemeProvider, useThemeMode } from './ThemeProvider';

function ModeProbe() {
  const { mode, toggle } = useThemeMode();
  return (
    <Button onClick={toggle} data-testid="probe">
      {mode}
    </Button>
  );
}

describe('ThemeProvider', () => {
  it('provides the default mode and toggles it', async () => {
    render(
      <ThemeProvider defaultMode="light">
        <ModeProbe />
      </ThemeProvider>,
    );
    const probe = screen.getByTestId('probe');
    expect(probe).toHaveTextContent('light');
    await userEvent.click(probe);
    expect(probe).toHaveTextContent('dark');
  });

  it('notifies onModeChange and respects controlled mode', async () => {
    const changes: string[] = [];
    render(
      <ThemeProvider mode="dark" onModeChange={(m) => changes.push(m)}>
        <ModeProbe />
      </ThemeProvider>,
    );
    const probe = screen.getByTestId('probe');
    expect(probe).toHaveTextContent('dark');
    await userEvent.click(probe);
    // Controlled: internal state does not change, but the callback fires.
    expect(changes).toEqual(['light']);
    expect(probe).toHaveTextContent('dark');
  });

  it('throws when useThemeMode is used outside the provider', () => {
    expect(() => render(<ModeProbe />)).toThrow(/within a <ThemeProvider>/);
  });
});
