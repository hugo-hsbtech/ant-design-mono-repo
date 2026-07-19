'use server';
import { revalidatePath } from 'next/cache';
import { createHotel, deleteHotel, updateHotel } from '@/lib/api';
import type { CreateHotelInput, UpdateHotelInput } from '@/lib/types';

export async function createHotelAction(input: CreateHotelInput) {
  await createHotel(input);
  revalidatePath('/hotels');
}

export async function updateHotelAction(id: string, input: UpdateHotelInput) {
  await updateHotel(id, input);
  revalidatePath('/hotels');
}

export async function deleteHotelAction(id: string) {
  await deleteHotel(id);
  revalidatePath('/hotels');
}
