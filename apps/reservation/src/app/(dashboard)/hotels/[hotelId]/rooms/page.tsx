import { notFound } from 'next/navigation';
import { ApiError, getHotel, listRooms } from '@/lib/api';
import { RoomsView } from './rooms-view';

export default async function RoomsPage({ params }: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await params;
  try {
    const [hotel, rooms] = await Promise.all([getHotel(hotelId), listRooms(hotelId)]);
    return <RoomsView hotel={hotel} rooms={rooms} />;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
