'use client';

import { useMemo, useState } from 'react';
import {
  FILTERABLE_TRAITS,
  SORT_LABELS,
  buildTraitOptions,
  createEmptyNormieFilters,
  getActiveFilterTags,
  isNormieFilterActive,
  removeActiveFilterTag,
  type CustomizedFilter,
  type NormieFilterState,
  type RarityNormie,
} from '@/lib/rarity';

interface NFTFiltersProps {
  tokenIds: string[];
  metadata: Map<string, RarityNormie>;
  filters: NormieFilterState;
  onChange: (filters: NormieFilterState) => void;
  loading?: boolean;
  error?: string | null;
}

const customizedOptions: Array<{ value: CustomizedFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

export function NFTFilters({
  tokenIds,
  metadata,
  filters,
  onChange,
  loading,
  error,
}: NFTFiltersProps) {
  const [open, setOpen] = useState(false);
  const traitOptions = useMemo(() => buildTraitOptions(tokenIds, metadata), [tokenIds, metadata]);
  const active = isNormieFilterActive(filters);
  const activeTags = useMemo(() => getActiveFilterTags(filters), [filters]);
  const statusLabel = error ? 'Rarity data unavailable' : loading ? 'Syncing rarity snapshot' : null;

  const update = (patch: Partial<NormieFilterState>) => {
    onChange({ ...filters, ...patch });
  };

  const reset = () => {
    onChange(createEmptyNormieFilters());
  };

  const removeTag = (key: string) => {
    onChange(removeActiveFilterTag(filters, key));
  };

  const toggleTrait = (trait: string, value: string, checked: boolean) => {
    const current = filters.traits[trait] ?? [];
    const nextValues = checked
      ? [...current, value]
      : current.filter((item) => item !== value);
    const nextTraits = { ...filters.traits };

    if (nextValues.length > 0) {
      nextTraits[trait] = nextValues;
    } else {
      delete nextTraits[trait];
    }

    update({ traits: nextTraits });
  };

  return (
    <section className="border border-normies-dark/50 bg-normies-dark/[0.03] dark:border-normies-light/50 dark:bg-normies-light/[0.03]">
      <div className="grid gap-3 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`h-2 w-2 ${
                active
                  ? 'bg-normies-dark dark:bg-normies-light'
                  : 'border border-normies-dark/50 dark:border-normies-light/50'
              }`}
            />
            <h3 className="text-[10px] uppercase tracking-[0.28em] opacity-80">Filter Deck</h3>
            {statusLabel && (
              <span className="border border-normies-dark/20 px-1.5 py-0.5 text-[9px] uppercase tracking-widest opacity-50 dark:border-normies-light/20">
                {statusLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {active && (
            <button
              type="button"
              onClick={reset}
              className="border border-normies-dark/40 px-3 py-2 text-[10px] uppercase tracking-widest opacity-70 transition-colors hover:border-normies-dark hover:opacity-100 active:translate-y-px dark:border-normies-light/40 dark:hover:border-normies-light"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className={`border px-3 py-2 text-[10px] uppercase tracking-widest transition-colors active:translate-y-px ${
              open
                ? 'border-normies-dark/40 hover:border-normies-dark dark:border-normies-light/40 dark:hover:border-normies-light'
                : 'border-normies-dark bg-normies-dark text-normies-light hover:opacity-85 dark:border-normies-light dark:bg-normies-light dark:text-normies-darker'
            }`}
          >
            {open ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-normies-dark/15 p-3 pt-2 dark:border-normies-light/15">
          {activeTags.map((tag) => (
            <button
              key={tag.key}
              type="button"
              onClick={() => removeTag(tag.key)}
              className="flex items-center gap-1.5 border border-normies-dark/30 bg-normies-dark/[0.04] px-2 py-1 text-[9px] uppercase tracking-widest opacity-75 transition-colors hover:border-normies-dark hover:opacity-100 active:translate-y-px dark:border-normies-light/30 dark:bg-normies-light/[0.04] dark:hover:border-normies-light"
            >
              {tag.label}
              <span aria-hidden="true" className="opacity-60">
                ×
              </span>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="space-y-4 border-t border-normies-dark/20 p-3 dark:border-normies-light/20">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest opacity-50">Search</span>
              <input
                type="search"
                value={filters.search}
                onChange={(event) => update({ search: event.target.value })}
                placeholder="ID, accessory, trait"
                className={controlClassName}
              />
            </label>

            <label className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest opacity-50">Sort</span>
              <select
                value={filters.sort}
                onChange={(event) => update({ sort: event.target.value as NormieFilterState['sort'] })}
                className={`${controlClassName} normies-select`}
                aria-label="Sort Normies"
              >
                {SORT_LABELS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 lg:grid-cols-[13rem_minmax(0,1fr)]">
            <div className="border border-normies-dark/25 p-2 dark:border-normies-light/25">
              <p className="mb-2 text-[10px] uppercase tracking-widest opacity-50">Customized</p>
              <div className="grid grid-cols-3 gap-1">
                {customizedOptions.map((option) => {
                  const selected = filters.customized === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => update({ customized: option.value })}
                      className={`border px-2 py-2 text-[10px] uppercase tracking-wider transition-colors active:translate-y-px ${
                        selected
                          ? 'border-normies-dark bg-normies-dark text-normies-light dark:border-normies-light dark:bg-normies-light dark:text-normies-darker'
                          : 'border-normies-dark/25 opacity-60 hover:border-normies-dark hover:opacity-100 dark:border-normies-light/25 dark:hover:border-normies-light'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <RangePair
                label="Action Points"
                min={filters.actionMin}
                max={filters.actionMax}
                onMin={(actionMin) => update({ actionMin })}
                onMax={(actionMax) => update({ actionMax })}
              />
              <RangePair
                label="Level"
                min={filters.levelMin}
                max={filters.levelMax}
                onMin={(levelMin) => update({ levelMin })}
                onMax={(levelMax) => update({ levelMax })}
              />
              <RangePair
                label="Pixels"
                min={filters.pixelMin}
                max={filters.pixelMax}
                onMin={(pixelMin) => update({ pixelMin })}
                onMax={(pixelMax) => update({ pixelMax })}
              />
            </div>
          </div>

          <div className="border border-normies-dark/25 dark:border-normies-light/25">
            <p className="border-b border-normies-dark/15 px-3 py-2 text-[10px] uppercase tracking-widest opacity-50 dark:border-normies-light/15">
              Trait Matrix
            </p>
            <div className="divide-y divide-normies-dark/15 dark:divide-normies-light/15">
              {FILTERABLE_TRAITS.map((trait) => {
                const options = traitOptions[trait] ?? [];
                if (options.length === 0) return null;
                const selected = new Set(filters.traits[trait] ?? []);
                return (
                  <details key={trait} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-[10px] uppercase tracking-widest opacity-70 transition-opacity hover:opacity-100">
                      <span className="flex min-w-0 items-center gap-2">
                        <svg
                          viewBox="0 0 8 8"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-2 w-2 shrink-0 transition-transform group-open:rotate-90"
                        >
                          <path d="M2 0l4 4-4 4z" />
                        </svg>
                        <span className="truncate">{trait}</span>
                      </span>
                      <span className="shrink-0 tabular-nums opacity-50">
                        {selected.size > 0 ? selected.size : options.length}
                      </span>
                    </summary>
                    <div className="max-h-48 space-y-1 overflow-y-auto p-3 pt-0">
                      {options.map((option) => (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center justify-between gap-2 border px-2 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                            selected.has(option.value)
                              ? 'border-normies-dark bg-normies-dark text-normies-light dark:border-normies-light dark:bg-normies-light dark:text-normies-darker'
                              : 'border-normies-dark/20 opacity-65 hover:border-normies-dark/60 hover:opacity-100 dark:border-normies-light/20 dark:hover:border-normies-light/60'
                          }`}
                        >
                          <span className="truncate">{option.value}</span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="tabular-nums opacity-55">{option.count}</span>
                            <input
                              type="checkbox"
                              checked={selected.has(option.value)}
                              onChange={(event) => toggleTrait(trait, option.value, event.target.checked)}
                              className="size-3 accent-normies-dark dark:accent-normies-light"
                            />
                          </span>
                        </label>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function RangePair({
  label,
  min,
  max,
  onMin,
  onMax,
}: {
  label: string;
  min: string;
  max: string;
  onMin: (value: string) => void;
  onMax: (value: string) => void;
}) {
  return (
    <div className="border border-normies-dark/25 p-2 dark:border-normies-light/25">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[10px] uppercase tracking-widest opacity-50">{label}</p>
        <span className="text-[9px] uppercase tracking-widest opacity-35">Min / Max</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1">
        <input
          type="number"
          inputMode="numeric"
          value={min}
          onChange={(event) => onMin(event.target.value)}
          placeholder="Min"
          className={controlClassName}
        />
        <input
          type="number"
          inputMode="numeric"
          value={max}
          onChange={(event) => onMax(event.target.value)}
          placeholder="Max"
          className={controlClassName}
        />
      </div>
    </div>
  );
}

const controlClassName =
  'h-10 w-full min-w-0 border border-normies-dark/25 bg-transparent px-3 text-xs uppercase tracking-wider outline-none transition-colors placeholder:opacity-35 focus:border-normies-dark dark:border-normies-light/25 dark:focus:border-normies-light';
