import { listHotels } from '@/lib/api';
import { HotelsView } from './hotels-view';

export default async function HotelsPage() {
  const hotels = await listHotels();
  return <HotelsView hotels={hotels} />;
}
