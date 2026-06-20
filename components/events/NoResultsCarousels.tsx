import { EventCard } from "@components/events/EventCard";
import { EventCardById } from "@components/events/EventCardById";
import { searchEvents } from "@lib/algolia/events";
import { isSanityEnvConfigured } from "@lib/env-configured.server";
import { getSearchPageContent } from "@lib/sanity/get-search-page";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PanelCarouselProps = {
  title: string;
  description: string | null;
  panelKey: string;
  eventIds: string[];
};

/**
 * A single horizontally-scrollable panel carousel.
 * The prev/next buttons use CSS scroll via an id-anchored approach.
 */
function PanelCarousel({ title, description, panelKey, eventIds }: PanelCarouselProps) {
  return (
    <section aria-labelledby={`panel-${panelKey}-heading`} className="mt-10 w-full">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id={`panel-${panelKey}-heading`}
            className="text-xl font-bold text-foreground"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="Scroll left"
            className="carousel-prev flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
            data-carousel={panelKey}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className="carousel-next flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
            data-carousel={panelKey}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id={`carousel-${panelKey}`}
        className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {eventIds.map((id) => (
          <div key={id} className="w-72 shrink-0 snap-start">
            <EventCardById eventId={id} />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Server component: renders Sanity-configured panels (or fallback upcoming events)
 * as horizontal carousels below the no-results message.
 */
export async function NoResultsCarousels() {
  const sanityContent = isSanityEnvConfigured()
    ? await getSearchPageContent()
    : null;

  const panels = sanityContent?.panels ?? [];

  if (panels.length > 0) {
    return (
      <>
        {panels.map((panel) => (
          <PanelCarousel
            key={panel.key}
            panelKey={panel.key}
            title={panel.title}
            description={panel.description}
            eventIds={panel.eventIds}
          />
        ))}
        <CarouselScrollScript />
      </>
    );
  }

  // Fallback: upcoming events carousel
  const { hits } = await searchEvents({ hitsPerPage: 8, sort: "date_asc" });
  if (hits.length === 0) return null;

  return (
    <>
      <section aria-labelledby="upcoming-heading" className="mt-10 w-full">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="upcoming-heading"
            className="text-xl font-bold text-foreground"
          >
            Upcoming Christian Events
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label="Scroll left"
              className="carousel-prev flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
              data-carousel="upcoming"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              className="carousel-next flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
              data-carousel="upcoming"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div
          id="carousel-upcoming"
          className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {hits.map((event) => (
            <div key={event.objectID} className="w-72 shrink-0 snap-start">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </section>
      <CarouselScrollScript />
    </>
  );
}

/** Inline script to wire up prev/next carousel buttons via DOM scroll. */
function CarouselScrollScript() {
  const script = `
(function(){
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-carousel]');
    if(!btn) return;
    var key = btn.getAttribute('data-carousel');
    var el = document.getElementById('carousel-' + key);
    if(!el) return;
    var dir = btn.classList.contains('carousel-prev') ? -1 : 1;
    el.scrollBy({ left: dir * 304, behavior: 'smooth' });
  });
})();
  `.trim();
  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
