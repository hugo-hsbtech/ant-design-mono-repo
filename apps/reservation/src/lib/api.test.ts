import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, listHotels, createHotel, getHotel, createRoom } from './api';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response);
}

beforeEach(() => {
  process.env.RESERVATION_API_URL = 'http://api.test';
  process.env.RESERVATION_API_TOKEN = 'secret-token';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api client', () => {
  it('sends the Authorization: Token header and returns the body', async () => {
    const fetchMock = mockFetch(200, [{ id: 'h1', name: 'Grand', createdAt: '', updatedAt: '' }]);
    vi.stubGlobal('fetch', fetchMock);

    const hotels = await listHotels();

    expect(hotels).toHaveLength(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('http://api.test/hotels');
    expect((init.headers as Record<string, string>).Authorization).toBe('Token secret-token');
    expect(init.cache).toBe('no-store');
  });

  it('POSTs create bodies as JSON', async () => {
    const fetchMock = mockFetch(201, { id: 'h2', name: 'Plaza', createdAt: '', updatedAt: '' });
    vi.stubGlobal('fetch', fetchMock);

    await createHotel({ name: 'Plaza' });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('http://api.test/hotels');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'Plaza' });
  });

  it('maps 401 to an invalid-token ApiError', async () => {
    vi.stubGlobal('fetch', mockFetch(401, { message: 'nope' }));
    await expect(listHotels()).rejects.toMatchObject({ status: 401, message: 'Invalid API token' });
  });

  it('maps 404 to an ApiError carrying the status', async () => {
    vi.stubGlobal('fetch', mockFetch(404, { message: 'Hotel x not found' }));
    await expect(getHotel('x')).rejects.toBeInstanceOf(ApiError);
    await expect(getHotel('x')).rejects.toMatchObject({ status: 404 });
  });

  it('maps 409 on room create to a duplicate-number message', async () => {
    vi.stubGlobal('fetch', mockFetch(409, { message: 'duplicate' }));
    await expect(createRoom('h1', { number: '101' })).rejects.toMatchObject({
      status: 409,
      message: 'Room number already exists in this hotel',
    });
  });

  it('throws a clear error when env is missing', async () => {
    delete process.env.RESERVATION_API_URL;
    vi.stubGlobal('fetch', mockFetch(200, []));
    await expect(listHotels()).rejects.toThrow(/RESERVATION_API_URL/);
  });
});
