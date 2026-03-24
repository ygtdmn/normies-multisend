'use client';

import type { NFT } from '@/types/nft';
import { NFTCard } from './NFTCard';

interface NFTGridProps {
  nfts: NFT[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function NFTGrid({ nfts, selected, onToggle, onSelectAll, onDeselectAll }: NFTGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-xs uppercase tracking-wider ${selected.size > 50 ? 'text-red-500' : 'opacity-60'}`}>
          {selected.size} of {nfts.length} selected{selected.size > 50 ? ' (max 50)' : ''}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onSelectAll}
            className="border border-normies-dark dark:border-normies-light px-3 py-1.5 text-xs uppercase tracking-wider
              hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker transition-colors cursor-pointer"
          >
            Select All
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

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.identifier}
            nft={nft}
            selected={selected.has(nft.identifier)}
            onToggle={() => onToggle(nft.identifier)}
          />
        ))}
      </div>
    </div>
  );
}
