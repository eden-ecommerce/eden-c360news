import { EventCard } from "@components/events/EventCard";
import { getEventById } from "@lib/algolia/events";

/** Server component: fetches a single event by id then renders an EventCard. */
export async function EventCardById({ eventId }: { eventId: string }) {
  const event = await getEventById(eventId);
  if (!event) return null;
  return <EventCard event={event} />;
}
