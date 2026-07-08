'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRarityNormiesByIds, type RarityNormie } from '@/lib/rarity';

export function useRarityNormies(tokenIds: Array<string | number | bigint>) {
  const ids = useMemo(
    () => [...new Set(tokenIds.map((id) => id.toString()))].sort((a, b) => Number(a) - Number(b)),
    [tokenIds],
  );
  const key = ids.join(',');
  const emptyMetadata = useMemo(() => new Map<string, RarityNormie>(), []);

  const query = useQuery({
    queryKey: ['rarity-normies', key],
    queryFn: ({ signal }) => fetchRarityNormiesByIds(ids, signal),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const metadata = useMemo(() => {
    if (!key) return emptyMetadata;
    return new Map((query.data ?? []).map((item) => [item.id.toString(), item]));
  }, [emptyMetadata, key, query.data]);

  return {
    metadata,
    loading: ids.length > 0 && query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
