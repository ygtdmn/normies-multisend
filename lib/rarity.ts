'use client';

export type RarityAttribute = {
  trait_type: string;
  value: string | number;
  display_type?: string;
};

export type RarityNormie = {
  id: number;
  name: string;
  rank?: number;
  rarityScore?: number;
  attributes: RarityAttribute[];
};

export type CustomizedFilter = 'all' | 'yes' | 'no';

export type NormieSort =
  | 'id-asc'
  | 'id-desc'
  | 'rank-asc'
  | 'rank-desc'
  | 'action-desc'
  | 'action-asc'
  | 'level-desc'
  | 'level-asc'
  | 'pixel-desc'
  | 'pixel-asc';

export type NormieFilterState = {
  search: string;
  sort: NormieSort;
  customized: CustomizedFilter;
  actionMin: string;
  actionMax: string;
  levelMin: string;
  levelMax: string;
  pixelMin: string;
  pixelMax: string;
  traits: Record<string, string[]>;
};

type RarityListResponse = {
  items?: RarityNormie[];
};

export const RARITY_API_BASE = (
  process.env.NEXT_PUBLIC_RARITY_API_BASE ?? 'https://api.normies.art/rarity'
).replace(/\/$/, '');

export const FILTERABLE_TRAITS = [
  'Type',
  'Gender',
  'Age',
  'Hair Style',
  'Facial Feature',
  'Eyes',
  'Expression',
  'Accessory',
] as const;

export const SORT_LABELS: Array<{ value: NormieSort; label: string }> = [
  { value: 'id-asc', label: 'ID ASC' },
  { value: 'id-desc', label: 'ID DESC' },
  { value: 'rank-asc', label: 'Rarity ASC' },
  { value: 'rank-desc', label: 'Rarity DESC' },
  { value: 'action-desc', label: 'AP HIGH' },
  { value: 'action-asc', label: 'AP LOW' },
  { value: 'level-desc', label: 'Level HIGH' },
  { value: 'level-asc', label: 'Level LOW' },
  { value: 'pixel-desc', label: 'Pixels HIGH' },
  { value: 'pixel-asc', label: 'Pixels LOW' },
];

export function createEmptyNormieFilters(): NormieFilterState {
  return {
    search: '',
    sort: 'id-asc',
    customized: 'all',
    actionMin: '',
    actionMax: '',
    levelMin: '',
    levelMax: '',
    pixelMin: '',
    pixelMax: '',
    traits: {},
  };
}

export function isNormieFilterActive(filters: NormieFilterState): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.customized !== 'all' ||
    filters.actionMin.trim() !== '' ||
    filters.actionMax.trim() !== '' ||
    filters.levelMin.trim() !== '' ||
    filters.levelMax.trim() !== '' ||
    filters.pixelMin.trim() !== '' ||
    filters.pixelMax.trim() !== '' ||
    Object.values(filters.traits).some((values) => values.length > 0)
  );
}

export type ActiveFilterTag = {
  key: string;
  label: string;
};

export function getActiveFilterTags(filters: NormieFilterState): ActiveFilterTag[] {
  const tags: ActiveFilterTag[] = [];

  if (filters.search.trim() !== '') {
    tags.push({ key: 'search', label: `Search: ${filters.search.trim()}` });
  }
  if (filters.customized !== 'all') {
    tags.push({ key: 'customized', label: `Customized: ${filters.customized === 'yes' ? 'Yes' : 'No'}` });
  }
  if (filters.actionMin.trim() !== '' || filters.actionMax.trim() !== '') {
    tags.push({ key: 'action', label: `AP: ${filters.actionMin || '0'}–${filters.actionMax || '∞'}` });
  }
  if (filters.levelMin.trim() !== '' || filters.levelMax.trim() !== '') {
    tags.push({ key: 'level', label: `Level: ${filters.levelMin || '0'}–${filters.levelMax || '∞'}` });
  }
  if (filters.pixelMin.trim() !== '' || filters.pixelMax.trim() !== '') {
    tags.push({ key: 'pixel', label: `Pixels: ${filters.pixelMin || '0'}–${filters.pixelMax || '∞'}` });
  }
  for (const [trait, values] of Object.entries(filters.traits)) {
    for (const value of values) {
      tags.push({ key: `trait:${trait}:${value}`, label: `${trait}: ${value}` });
    }
  }

  return tags;
}

export function removeActiveFilterTag(filters: NormieFilterState, key: string): NormieFilterState {
  if (key === 'search') return { ...filters, search: '' };
  if (key === 'customized') return { ...filters, customized: 'all' };
  if (key === 'action') return { ...filters, actionMin: '', actionMax: '' };
  if (key === 'level') return { ...filters, levelMin: '', levelMax: '' };
  if (key === 'pixel') return { ...filters, pixelMin: '', pixelMax: '' };

  if (key.startsWith('trait:')) {
    const rest = key.slice('trait:'.length);
    const separatorIndex = rest.indexOf(':');
    if (separatorIndex === -1) return filters;
    const trait = rest.slice(0, separatorIndex);
    const value = rest.slice(separatorIndex + 1);
    const nextTraits = { ...filters.traits };
    const nextValues = (nextTraits[trait] ?? []).filter((item) => item !== value);
    if (nextValues.length > 0) {
      nextTraits[trait] = nextValues;
    } else {
      delete nextTraits[trait];
    }
    return { ...filters, traits: nextTraits };
  }

  return filters;
}

export function getTraitValue(normie: RarityNormie | undefined, trait: string) {
  return normie?.attributes.find((attr) => attr.trait_type.toLowerCase() === trait.toLowerCase())?.value;
}

export function getTraitText(normie: RarityNormie | undefined, trait: string): string | undefined {
  const value = getTraitValue(normie, trait);
  if (value === undefined || value === null) return undefined;
  return String(value);
}

export function getTraitNumber(normie: RarityNormie | undefined, trait: string): number {
  const value = getTraitValue(normie, trait);
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function isCustomized(normie: RarityNormie | undefined): boolean {
  return getTraitText(normie, 'Customized')?.toLowerCase() === 'yes';
}

export function notableAccessory(normie: RarityNormie | undefined): string | undefined {
  const accessory = getTraitText(normie, 'Accessory');
  if (!accessory || /^(none|no accessor(?:y|ies)|no)$/i.test(accessory)) return undefined;
  return accessory;
}

export function filterNormieIds(
  ids: string[],
  metadata: Map<string, RarityNormie>,
  filters: NormieFilterState,
): string[] {
  const active = isNormieFilterActive(filters);
  const filtered = ids.filter((id) => {
    const normie = metadata.get(id);
    if (!normie) return !active;
    return matchesFilters(id, normie, filters);
  });

  return filtered.sort((a, b) => compareNormies(a, b, metadata, filters.sort));
}

export function buildTraitOptions(ids: string[], metadata: Map<string, RarityNormie>) {
  const counts: Record<string, Array<{ value: string; count: number }>> = {};

  for (const trait of FILTERABLE_TRAITS) {
    const byValue = new Map<string, number>();
    for (const id of ids) {
      const value = getTraitText(metadata.get(id), trait);
      if (!value) continue;
      byValue.set(value, (byValue.get(value) ?? 0) + 1);
    }
    counts[trait] = [...byValue.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
  }

  return counts;
}

export async function fetchRarityNormiesByIds(
  tokenIds: Array<string | number | bigint>,
  signal?: AbortSignal,
): Promise<RarityNormie[]> {
  const ids = [...new Set(tokenIds.map((id) => id.toString()))].filter(Boolean);
  if (ids.length === 0) return [];

  const chunks = chunk(ids, 100);
  const responses = await Promise.all(
    chunks.map(async (group) => {
      const params = new URLSearchParams({
        wallet_ids: group.join(','),
        limit: '100',
        sort: 'id|asc',
      });
      const res = await fetch(`${RARITY_API_BASE}/normies?${params.toString()}`, { signal });
      if (!res.ok) throw new Error(`Rarity API responded ${res.status}`);
      const data = (await res.json()) as RarityListResponse;
      return data.items ?? [];
    }),
  );

  return responses.flat();
}

function matchesFilters(id: string, normie: RarityNormie, filters: NormieFilterState): boolean {
  const query = filters.search.trim().toLowerCase();
  if (query) {
    const haystack = [
      id,
      normie.name,
      ...normie.attributes.map((attr) => `${attr.trait_type} ${attr.value}`),
    ]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  if (filters.customized !== 'all') {
    const customized = isCustomized(normie);
    if (filters.customized === 'yes' && !customized) return false;
    if (filters.customized === 'no' && customized) return false;
  }

  if (!matchesNumberRange(getTraitNumber(normie, 'Action Points'), filters.actionMin, filters.actionMax)) {
    return false;
  }
  if (!matchesNumberRange(getTraitNumber(normie, 'Level'), filters.levelMin, filters.levelMax)) {
    return false;
  }
  if (!matchesNumberRange(getTraitNumber(normie, 'Pixel Count'), filters.pixelMin, filters.pixelMax)) {
    return false;
  }

  for (const [trait, selected] of Object.entries(filters.traits)) {
    if (selected.length === 0) continue;
    const value = getTraitText(normie, trait);
    if (!value || !selected.includes(value)) return false;
  }

  return true;
}

function matchesNumberRange(value: number, minRaw: string, maxRaw: string): boolean {
  const min = parseOptionalNumber(minRaw);
  const max = parseOptionalNumber(maxRaw);
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
}

function parseOptionalNumber(raw: string): number | null {
  if (raw.trim() === '') return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function compareNormies(
  a: string,
  b: string,
  metadata: Map<string, RarityNormie>,
  sort: NormieSort,
): number {
  const left = metadata.get(a);
  const right = metadata.get(b);
  const idCompare = Number(a) - Number(b);

  switch (sort) {
    case 'id-desc':
      return -idCompare;
    case 'rank-asc':
      return compareOptionalNumber(left?.rank, right?.rank) || idCompare;
    case 'rank-desc':
      return compareOptionalNumber(right?.rank, left?.rank) || idCompare;
    case 'action-desc':
      return getTraitNumber(right, 'Action Points') - getTraitNumber(left, 'Action Points') || idCompare;
    case 'action-asc':
      return getTraitNumber(left, 'Action Points') - getTraitNumber(right, 'Action Points') || idCompare;
    case 'level-desc':
      return getTraitNumber(right, 'Level') - getTraitNumber(left, 'Level') || idCompare;
    case 'level-asc':
      return getTraitNumber(left, 'Level') - getTraitNumber(right, 'Level') || idCompare;
    case 'pixel-desc':
      return getTraitNumber(right, 'Pixel Count') - getTraitNumber(left, 'Pixel Count') || idCompare;
    case 'pixel-asc':
      return getTraitNumber(left, 'Pixel Count') - getTraitNumber(right, 'Pixel Count') || idCompare;
    case 'id-asc':
    default:
      return idCompare;
  }
}

function compareOptionalNumber(a: number | undefined, b: number | undefined): number {
  const left = typeof a === 'number' && Number.isFinite(a) ? a : Number.POSITIVE_INFINITY;
  const right = typeof b === 'number' && Number.isFinite(b) ? b : Number.POSITIVE_INFINITY;
  return left - right;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
