import rawTree from "@lib/locations/uk-locations.json";

export type Town = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  population: number;
};

export type County = {
  name: string;
  slug: string;
  townCount: number;
  towns: Town[];
};

export type Region = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  counties: County[];
};

export type LocationTree = {
  country: { name: string; slug: string };
  regions: Region[];
};

const tree = rawTree as LocationTree;

export const locationTree = tree;

export function getRegions(): Region[] {
  return tree.regions;
}

export function getRegion(regionSlug: string): Region | undefined {
  return tree.regions.find((r) => r.slug === regionSlug);
}

export function getCounty(
  regionSlug: string,
  countySlug: string,
): { region: Region; county: County } | undefined {
  const region = getRegion(regionSlug);
  if (!region) return undefined;
  const county = region.counties.find((c) => c.slug === countySlug);
  if (!county) return undefined;
  return { region, county };
}

export function getTown(
  regionSlug: string,
  countySlug: string,
  townSlug: string,
):
  | { region: Region; county: County; town: Town }
  | undefined {
  const match = getCounty(regionSlug, countySlug);
  if (!match) return undefined;
  const town = match.county.towns.find((t) => t.slug === townSlug);
  if (!town) return undefined;
  return { ...match, town };
}

/** Flat list of all towns with their county/region context, for autocomplete. */
export type TownSearchEntry = Town & {
  regionName: string;
  regionSlug: string;
  countyName: string;
  countySlug: string;
};

let cachedFlatTowns: TownSearchEntry[] | null = null;

export function getAllTowns(): TownSearchEntry[] {
  if (cachedFlatTowns) return cachedFlatTowns;
  const out: TownSearchEntry[] = [];
  for (const region of tree.regions) {
    for (const county of region.counties) {
      for (const town of county.towns) {
        out.push({
          ...town,
          regionName: region.name,
          regionSlug: region.slug,
          countyName: county.name,
          countySlug: county.slug,
        });
      }
    }
  }
  cachedFlatTowns = out;
  return out;
}

/** Totals for display on the browse landing. */
export function getLocationStats() {
  const regions = tree.regions.length;
  let counties = 0;
  let towns = 0;
  for (const region of tree.regions) {
    counties += region.counties.length;
    towns += region.counties.reduce((sum, c) => sum + c.towns.length, 0);
  }
  return { regions, counties, towns };
}
