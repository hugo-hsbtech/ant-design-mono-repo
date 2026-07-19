import 'server-only';
import type {
  CreateHotelInput,
  CreateRoomInput,
  Hotel,
  Room,
  UpdateHotelInput,
  UpdateRoomInput,
} from './types';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function config(): { baseUrl: string; token: string } {
  const baseUrl = process.env.RESERVATION_API_URL;
  const token = process.env.RESERVATION_API_TOKEN;
  if (!baseUrl || !token) {
    throw new Error(
      'RESERVATION_API_URL and RESERVATION_API_TOKEN must be set to reach the reservation API',
    );
  }
  return { baseUrl: baseUrl.replace(/\/$/, ''), token };
}

function mapError(status: number, body: unknown): string {
  if (status === 401) return 'Invalid API token';
  if (status === 409) return 'Room number already exists in this hotel';
  const message = (body as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return `Request failed with status ${status}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { baseUrl, token } = config();
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
      ...init?.headers,
    },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, mapError(res.status, body));
  }
  return body as T;
}

// ── Hotels ──────────────────────────────────────────────────────────────────
export const listHotels = () => request<Hotel[]>('/hotels');
export const getHotel = (id: string) => request<Hotel>(`/hotels/${id}`);
export const createHotel = (input: CreateHotelInput) =>
  request<Hotel>('/hotels', { method: 'POST', body: JSON.stringify(input) });
export const updateHotel = (id: string, input: UpdateHotelInput) =>
  request<Hotel>(`/hotels/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
export const deleteHotel = (id: string) => request<void>(`/hotels/${id}`, { method: 'DELETE' });

// ── Rooms (nested under a hotel) ─────────────────────────────────────────────
export const listRooms = (hotelId: string) => request<Room[]>(`/hotels/${hotelId}/rooms`);
export const createRoom = (hotelId: string, input: CreateRoomInput) =>
  request<Room>(`/hotels/${hotelId}/rooms`, { method: 'POST', body: JSON.stringify(input) });
export const updateRoom = (hotelId: string, id: string, input: UpdateRoomInput) =>
  request<Room>(`/hotels/${hotelId}/rooms/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
export const deleteRoom = (hotelId: string, id: string) =>
  request<void>(`/hotels/${hotelId}/rooms/${id}`, { method: 'DELETE' });
