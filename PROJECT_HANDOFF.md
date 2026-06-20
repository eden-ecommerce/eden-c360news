# Eden Events Site - Project Handoff & Implementation Summary

## Project Overview
Built a comprehensive Christian event search and discovery platform for Eden.co.uk with advanced filtering, recurring event handling, location-based search, and favoriting functionality using Next.js 16, Tailwind CSS, Algolia, Sanity CMS, and Google Maps APIs.

---

## Implementation Timeline & Features

### Phase 1: Initial Content & User Journey Refinement
**Prompt 1-2: Content Layout & Hierarchical Filtering**
- Fixed EventCard to display date ranges (`formatCardDateRange`), times (`formatCardTime`), and category pills
- Implemented hierarchical category filter with back-navigation drill-down (lvl0-lvl4)
- Replaced flat category list with Algolia InstantSearch hierarchical menu primitive
- Result: 4 new format helpers, hierarchical filter component supporting 5 nesting levels

**Issues Encountered:**
- Category hierarchical menu was rendering in a **disconnected InstantSearch instance** — facet counts didn't reflect main search results
- **Fix:** Replaced InstantSearch wrapper with URL-param-driven client component that reads/writes `category` search param, syncing with server-side facet query
- **Key Block:** Confusion about when to use InstantSearch vs. URL-driven state — the architecture mixes server-side Algolia queries with client-side URL param navigation

### Phase 2: Environment & Configuration
**Prompt 3: Basket URL & Hierarchical Menu Refinement**
- Updated basket link to `https://www.eden.co.uk/shop/basket.php`
- Extended facet query to support lvl3/lvl4 category hierarchy levels
- Positioned categories filter between Date Range and Organisation Type in AdvancedFilters sidebar

**Environment Management:**
- Ran `vercel pull` twice to sync Google Maps and other env variables
- **Key Block:** User had to manually run `vercel pull` — the system requires explicit env var syncing; no automatic detection or warning when env vars are added on Vercel side

### Phase 3: Content & Navigation
**Prompt 4: Search Experience & Occurrence Timestamps**
- Fixed category labels stripping `:::id` suffixes (e.g., "Community & Fellowship:::126" → "Community & Fellowship")
- Fixed date range active filter badges to show `From: DD/MM/YYYY To: DD/MM/YYYY` conditional formatting
- Updated date filtering to use `occurrenceStartTimestamps` arrays for recurring events
- Added Sanity-driven no-results carousels (panels with event IDs fetched from Algolia)
- Implemented Google Maps autocomplete home search with CF/browser location fallback
- Removed header search bar from all pages
- Added heart-shaped favorite button to event cards and detail page (localStorage-backed)

**Issues Encountered:**
- **server-only import chain:** Client component `CategoriesHierarchicalFilter` tried to import `cleanCategoryLabel` from `events.ts` which imports `server-only`
  - **Fix:** Extracted `cleanCategoryLabel` to new `lib/algolia/category-label.ts` (no server dependencies)
  - **Key Block:** Lack of clear import path guidance in v0 — client/server boundary crossing isn't always obvious from filenames; needs "server" vs "client" suffixes in filenames or explicit docs

- **Date range filtering crash:** Initially used `occurrenceStartTimestamps` (array attribute) in numeric filters, which isn't indexed in Algolia
  - **Fix:** Switched to `occurrenceStartTimestampMin` then later to correct attributes per handoff docs
  - **Key Block:** Algolia index schema wasn't documented upfront; required trial-and-error; eventually discovered handoff docs specified correct attributes (`occurrenceStartTimestampMin >= fromMs` and `occurrenceEndTimestampMax <= toMs`)

### Phase 4: Visual Polish & Home Search
**Prompt 5: Home Search Input Spacing & Date Range Fix**
- Fixed home search input spacing by removing double-wrapper div pattern
- Added `className` prop threading to `LocationSearch` component
- Changed date filter from `string[][]` (OR logic) to flat `string[]` (AND logic) — `>= X OR <= Y` matches everything

**Issues Encountered:**
- **Home search icon overlap:** `pl-12` on wrapper div didn't apply padding to the `<Input>` itself, causing MapPin icon to overlap text
  - **Fix:** Pass `className="pl-12"` directly to Input via new prop, simplify wrapper structure
  - **Key Block:** Nested component prop threading isn't automatic — each layer must explicitly accept and pass through styling props

### Phase 5: Date Range & Location Initialization
**Prompt 6: Handoff Docs Research & Carousel Scroll Buttons**
- Updated date range filter to use `occurrenceStartTimestampMin >= dateFrom` and `occurrenceEndTimestampMax <= dateTo` (per handoff spec)
- Fixed location initialiser: **removed Cloudflare IP auto-apply** — per handoff doc, CF headers must NOT auto-populate the location filter
  - New priority: localStorage → browser geolocation → London default
- Updated maps button icons: `Navigation` for Google Maps, `Map` for Apple Maps (lucide doesn't have Apple logo)
- Added prev/next scroll buttons to upcoming events carousel, matching Sanity panel carousel UI

**Issues Encountered:**
- **Handoff doc misalignment:** Instructions to filter by `occurrenceStartTimestamps` conflicted with actual Algolia index (has `occurrenceStartTimestampMin/Max`)
  - **Fix:** Used handoff spec's recommended attributes; required index coordination
  - **Key Block:** Algolia index schema and Sanity data structure weren't fully documented at project start — multiple iterations needed to sync spec with implementation

- **Location auto-apply confusion:** `LocationInitialiser` was applying Cloudflare location automatically, but handoff doc specified CF should only be used for display/fallback, not for auto-populating filters
  - **Fix:** Removed CF short-circuit path; now only browser geolocation + London default
  - **Key Block:** Conflicting interpretations of "fallback" — unclear if CF location should populate filter vs. display value

### Phase 6: Layout & Overflow Fixes
**Prompt 7: Carousel Overflow**
- Fixed carousel sections overflowing horizontally by adding `w-full` to sections
- Added `-mx-6 px-6` to carousel containers to allow edge-to-edge scrolling while respecting page bounds

---

## Critical Blocks & Structural Issues

### 1. **Server/Client Boundary Not Clear from Filenames**
- **Problem:** `lib/algolia/events.ts` has `import "server-only"` but doesn't indicate it in the filename. Client components imported utilities from it and crashed at runtime.
- **Impact:** Required creating parallel utility file (`category-label.ts`) to split concerns.
- **Recommendation:** Adopt explicit naming convention: `events.server.ts` vs `events.client.ts` or `events.shared.ts`. Add ESLint rule to enforce this.

### 2. **Algolia Index Schema Misalignment**
- **Problem:** Numeric filter attributes used in code didn't match what was configured in Algolia's `numericAttributesForFiltering`. Trial-and-error process:
  - Started with `occurrenceStartTimestamps` (array, not indexed)
  - Tried `nextOccurrenceStartTimestamp` (works but wrong semantics)
  - Finally `occurrenceStartTimestampMin`/`occurrenceEndTimestampMax` (correct per handoff)
- **Impact:** 3 separate commits to fix; date range filtering crashed twice before finding correct attributes.
- **Recommendation:** Document Algolia schema in project README with list of all numeric/searchable/faceted attributes and their purpose. Generate this from Algolia dashboard on setup.

### 3. **InstantSearch vs. URL-Driven State Confusion**
- **Problem:** Hierarchical category filter was initially built as a connected InstantSearch component (like older patterns), but the search page is server-side Algolia queries + client-side URL navigation. These two patterns conflict.
- **Impact:** Required complete rewrite of hierarchical filter component.
- **Recommendation:** Document in ARCHITECTURE.md when to use InstantSearch (interactive search UI on a dedicated page) vs. URL-driven state (server-side search with client-side filter state sync). The project uses the latter pattern consistently.

### 4. **Handoff Docs Not Available at Start**
- **Problem:** Key decisions (which Algolia attributes to filter on, how to handle location initialization, occurrence timestamp semantics) were only clarified via handoff docs provided mid-project.
- **Impact:** Multiple rewrites of date filtering and location logic; 2+ commits to align with spec.
- **Recommendation:** Create `HANDOFF.md` template in project root **at initialization** with section stubs (Location Strategy, Event Occurrence Logic, Algolia Schema, etc.). Fill these in during kickoff, not mid-project.

### 5. **Component Prop Threading Not Automatic**
- **Problem:** Styling props (like `className`) must be explicitly threaded through every wrapper component. `HomeLocationSearch` → `LocationSearch` → `Input` required adding `className` prop to intermediate layers.
- **Impact:** Visual bugs (input padding) that required understanding the full component tree.
- **Recommendation:** Adopt a "passthrough props" pattern: define a `ComponentProps` type that extends base element props + custom props, then forward all unknowns via `{...rest}`. Alternatively, use CSS wrapper containers instead of component composition for styling.

### 6. **Environment Variable Sync Requires Manual Steps**
- **Problem:** When env vars are added in Vercel dashboard, they must be manually synced with `vercel pull` — no warning or automatic detection in v0 IDE.
- **Impact:** User had to remember to run `vercel pull` twice; could have blocked feature if forgotten.
- **Recommendation:** Add pre-commit hook or dev server startup check that warns if `.env.local` is stale. Or integrate Vercel CLI detection into v0 preview startup.

### 7. **Lucide Icon Limitations**
- **Problem:** Attempted to use `Apple` icon from lucide for Apple Maps button, but it's not a real icon (silent failure).
- **Impact:** Wrong icon rendered; required switching to `Map` icon as substitute.
- **Recommendation:** Document available brand icons in v0 template README, or use explicit icon library (react-icons, heroicons) for company logos. Lucide is great for UI icons but limited for brands.

---

## Architecture Decisions

### Location Handling
- **Pattern:** CF headers read server-side in `LocationInitialiser`, used ONLY for display/context (not auto-applied to filters)
- **Filter state:** Stored in localStorage (key: `eden_user_location`) → synced with URL params (`lat`, `lng`, `place`)
- **Fallback chain:** localStorage → browser geolocation → London default
- **Why:** Ensures user agency — locations aren't force-applied; explicit user selection or browser permission drives filter state

### Date Range Filtering
- **Pattern:** Uses `occurrenceStartTimestampMin >= fromMs` AND `occurrenceEndTimestampMax <= toMs` numeric filters
- **Semantics:** Min/max across ALL occurrences of an event, so recurring events match if ANY occurrence overlaps the range
- **Why:** Ensures recurring events aren't filtered out just because `nextOccurrenceStartTimestamp` is outside the range

### Category Hierarchy
- **Pattern:** URL-param-driven drill-down (`category` param stores selected path), server-side facet query returns all 5 levels
- **Label stripping:** IDs removed via `cleanCategoryLabel` utility (shared client/server)
- **Why:** Keeps state synchronized between server query and client UI; no disconnected InstantSearch needed

### Search State Management
- **Pattern:** URL params as single source of truth (`q`, `category`, `from`, `to`, `lat`, `lng`, `place`, `type`)
- **Client-side updates:** Client components read params via `useSearchParams()`, write via router navigation
- **Why:** Bookmarkable searches, shareable URLs, back button works naturally

---

## Prompt Reduction Recommendations for Future Template Projects

### 1. **Kickoff Checklist (Before First Implementation Prompt)**
Create a `.template/KICKOFF.md` in the project template with required sections:

```markdown
# Project Kickoff Checklist

## External APIs & Integrations
- [ ] Algolia index schema documented (all numeric, searchable, faceted attributes)
- [ ] Sanity documents & fields documented
- [ ] Third-party handoff docs linked (location strategy, business logic, data semantics)

## Architecture Decisions
- [ ] State management pattern chosen (URL params, Context, localStorage, etc.)
- [ ] Server vs. Client component boundaries defined
- [ ] Component composition strategy documented (prop threading vs. wrapper containers)

## Environment & Secrets
- [ ] List of required env vars with descriptions
- [ ] Instructions to sync with `vercel pull` after setup
```

### 2. **Standardized File Naming**
- `*.server.ts` — Server-only utilities (import "server-only")
- `*.client.ts` — Client-only utilities (React hooks, browser APIs)
- `*.shared.ts` or no suffix — Safe for both (pure utilities, types)
- Add ESLint rule: error on server-only files imported in client components

### 3. **Data Schema Documentation**
Create `SCHEMA.md` at project root documenting:
```markdown
# Algolia Index Schema

## Numeric Attributes (for range filters)
- `occurrenceStartTimestampMin`: Earliest start time across all occurrences (ms)
- `occurrenceEndTimestampMax`: Latest end time across all occurrences (ms)
- etc.

## Faceted Attributes (for filters)
- `categoryHierarchy.lvl0`, `lvl1`, `lvl2`, `lvl3`, `lvl4`
- `organisationType`
- etc.
```

### 4. **Architecture Decision Record (ADR)**
Create `ARCHITECTURE.md` documenting patterns:
```markdown
# Architecture Patterns

## URL-Driven State
When to use: Multi-step forms, search filters, multi-page reports
Why: Bookmarkable, shareable, back button works
Pattern: Read from `useSearchParams()`, write via `router.push(?query=)`

## Server-Side Algolia Queries
When to use: Search pages with dynamic filters
Why: SEO, server-side aggregation, security (API keys server-only)
Pattern: Page component is RSC, fetches via `searchEvents()`, renders results

## Client-Side Search State
When to use: Interactive drill-down, instant filtering
Why: Real-time feedback, instant facet updates
Pattern: Use Algolia InstantSearch + `useInstantSearch()` hooks
```

### 5. **Component Composition Pattern**
Document the "intermediate prop threading" pattern:

```typescript
// ❌ DON'T: Forget to pass through styling props
type LocationSearchProps = {
  placeholder?: string;
  onSelect: (place) => void;
};

// ✅ DO: Define passthrough type, accept all props
type LocationSearchProps = React.ComponentProps<'input'> & {
  onSelect: (place) => void;
};

export function LocationSearch({ onSelect, ...rest }: LocationSearchProps) {
  return <Input {...rest} />;
}
```

### 6. **Setup Script for First-Time Developers**
Create `scripts/setup.sh` to run on clone:
```bash
#!/bin/bash
echo "Installing dependencies..."
pnpm install

echo "Syncing environment variables from Vercel..."
vercel pull --yes

echo "Checking Algolia schema..."
# Verify Algolia index exists, log schema

echo "✅ Setup complete. Review KICKOFF.md for architecture decisions."
```

---

## Summary: Time-Saving Changes for Template

| Issue | Root Cause | Template Improvement | Est. Prompt Savings |
|-------|-----------|----------------------|-------------------|
| Server/client import errors | Unclear boundaries | Add `.server`/`.client` suffixes + ESLint | 1-2 prompts |
| Algolia schema misalignment | Schema not documented | Add `SCHEMA.md` + setup script to verify | 2-3 prompts |
| InstantSearch vs. URL confusion | No pattern guidance | Add `ARCHITECTURE.md` with decision tree | 1-2 prompts |
| Handoff doc delays | Docs provided mid-project | Add `KICKOFF.md` checklist completed upfront | 1-2 prompts |
| Component prop threading bugs | Pattern not explicit | Document passthrough pattern in template | 1 prompt |
| Env var sync issues | Manual step forgotten | Add `.pre-commit` hook or startup warning | 0.5 prompt |
| Icon availability | No reference | Link to available lucide icons in README | 0.5 prompt |
| **Total estimated savings** | — | — | **7-12 prompts per project** |

By implementing these 6 changes to the template, future events-style projects should require ~7-12 fewer clarification/fix prompts during development.
