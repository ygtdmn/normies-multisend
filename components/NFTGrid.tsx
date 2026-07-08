'use client';

import type { NFT } from '@/types/nft';
import { NFTCard } from './NFTCard';
import type { RarityNormie } from '@/lib/rarity';

interface NFTGridProps {
  nfts: NFT[];
  totalCount: number;
  metadata: Map<string, RarityNormie>;
  selected: Set<string>;
  hiddenSelectedCount: number;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeselectHidden: () => void;
}

export function NFTGrid({
  nfts,
  totalCount,
  metadata,
  selected,
  hiddenSelectedCount,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onDeselectHidden,
}: NFTGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-xs uppercase tracking-wider ${selected.size > 50 ? 'text-red-500' : 'opacity-60'}`}>
          {selected.size} selected / {nfts.length} shown of {totalCount}
          {selected.size > 50 ? ' (max 50)' : ''}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onSelectAll}
            className="border border-normies-dark dark:border-normies-light px-3 py-1.5 text-xs uppercase tracking-wider
              hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker transition-colors cursor-pointer"
          >
            Select Shown
          </button>
          <button
            onClick={onDeselectAll}
            className="border border-normies-dark dark:border-normies-light px-3 py-1.5 text-xs uppercase tracking-wider
              hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker transition-colors cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      </div>

      {hiddenSelectedCount > 0 && (
        <div className="mb-4 flex flex-col gap-2 border border-red-600/50 p-3 text-[10px] uppercase tracking-widest text-red-600 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {hiddenSelectedCount} selected NFT{hiddenSelectedCount === 1 ? '' : 's'} hidden by filters
          </span>
          <button
            type="button"
            onClick={onDeselectHidden}
            className="w-fit border border-red-600/50 px-2 py-1 hover:border-red-600"
          >
            Deselect Hidden
          </button>
        </div>
      )}

      {nfts.length === 0 ? (
        <div className="border border-normies-dark dark:border-normies-light p-8 text-center">
          <p className="text-sm uppercase tracking-wider opacity-40">No matching Normies</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.identifier}
              nft={nft}
              selected={selected.has(nft.identifier)}
              onToggle={() => onToggle(nft.identifier)}
              metadata={metadata.get(nft.identifier)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
