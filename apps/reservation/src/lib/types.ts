export interface Hotel {
  id: string;
  name: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  number: string;
  type?: string;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelInput {
  name: string;
  address?: string;
}
export type UpdateHotelInput = Partial<CreateHotelInput>;

export interface CreateRoomInput {
  number: string;
  type?: string;
  capacity?: number;
}
export type UpdateRoomInput = Partial<CreateRoomInput>;
