import { NsLink } from "@components/ns-link";
import { FavouriteButton } from "@components/events/FavouriteButton";
import { NAMESPACE_PATH } from "@lib/config";
import type { EventHit } from "@lib/algolia/events";
import {
  formatCardDateRange,
  formatCardTime,
  formatDistance,
  formatPrice,
  locationLine,
} from "@lib/format";
import { CalendarDays, Clock, MapPin } from "lucide-react";

export function EventCard({ event }: { event: EventHit }) {
  // Use the first occurrence timestamps for date/time display
  const startMs = event.occurrenceStartTimestamps[0] ?? event.nextOccurrenceStartTimestamp;
  const endMs = event.occurrenceEndTimestamps[0] ?? event.nextOccurrenceEndTimestamp;

  const dateRange = formatCardDateRange(startMs, endMs);
  const timeRange = formatCardTime(startMs, endMs);
  const location = locationLine(event);
  const distance = formatDistance(event.distanceMeters);

  // Collect all non-null category levels for pill carousel
  const categories = [
    event.categoryLvl0,
    event.categoryLvl1,
    event.categoryLvl2,
  ].filter((c): c is string => Boolean(c));

  return (
    <NsLink
      href={`${NAMESPACE_PATH}/event/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {event.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <CalendarDays className="h-10 w-10" />
          </div>
        )}
        <div className="absolute right-3 top-3 z-10">
          <FavouriteButton eventId={event.id} variant="icon" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          {event.organiserLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.organiserLogo}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full object-contain"
              loading="lazy"
            />
          ) : null}
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground">
            {event.organisationName ?? "Christian event"}
          </span>
          {event.online ? (
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Online
            </span>
          ) : null}
        </div>

        <h3 className="text-pretty text-base font-semibold leading-snug text-foreground group-hover:text-primary">
          {event.title}
        </h3>

        {/* Category pills carousel */}
        {categories.length > 0 ? (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-1.5 text-sm text-muted-foreground">
          {dateRange ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
              {dateRange}
            </span>
          ) : null}
          {timeRange ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              {timeRange}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{location}</span>
          </span>
          {distance ? (
            <span className="text-xs text-primary">{distance}</span>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(event.price)}
          </span>
          <span className="text-sm font-medium text-primary group-hover:underline">
            View details
          </span>
        </div>
      </div>
    </NsLink>
  );
}
