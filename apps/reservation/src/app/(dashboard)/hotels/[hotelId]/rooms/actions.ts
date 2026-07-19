'use server';
import { revalidatePath } from 'next/cache';
import { createRoom, deleteRoom, updateRoom } from '@/lib/api';
import type { CreateRoomInput, UpdateRoomInput } from '@/lib/types';

export async function createRoomAction(hotelId: string, input: CreateRoomInput) {
  await createRoom(hotelId, input);
  revalidatePath(`/hotels/${hotelId}/rooms`);
}

export async function updateRoomAction(hotelId: string, id: string, input: UpdateRoomInput) {
  await updateRoom(hotelId, id, input);
  revalidatePath(`/hotels/${hotelId}/rooms`);
}

export async function deleteRoomAction(hotelId: string, id: string) {
  await deleteRoom(hotelId, id);
  revalidatePath(`/hotels/${hotelId}/rooms`);
}
