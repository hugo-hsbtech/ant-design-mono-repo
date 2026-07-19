import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@repo/design-system';
import { HotelsView } from './hotels-view';
import type { Hotel } from '@/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('./actions', () => ({
  createHotelAction: vi.fn(),
  updateHotelAction: vi.fn(),
  deleteHotelAction: vi.fn(),
}));

const hotels: Hotel[] = [
  { id: 'h1', name: 'Grand Hotel', address: '1 St', createdAt: '', updatedAt: '' },
  { id: 'h2', name: 'Plaza', createdAt: '', updatedAt: '' },
];

function renderView() {
  return render(
    <App>
      <HotelsView hotels={hotels} />
    </App>,
  );
}

describe('HotelsView', () => {
  it('renders a row per hotel', () => {
    renderView();
    expect(screen.getByText('Grand Hotel')).toBeInTheDocument();
    expect(screen.getByText('Plaza')).toBeInTheDocument();
  });

  it('opens the create modal when "New hotel" is clicked', async () => {
    renderView();
    await userEvent.click(screen.getByRole('button', { name: /New hotel/ }));
    expect(
      await screen.findByText('New hotel', { selector: '.ant-modal-title' }),
    ).toBeInTheDocument();
  });
});
