'use client';

import type { NFT } from '@/types/nft';
import { getTraitNumber, isCustomized, notableAccessory, type RarityNormie } from '@/lib/rarity';

interface NFTCardProps {
  nft: NFT;
  selected: boolean;
  onToggle: () => void;
  metadata?: RarityNormie;
}

export function NFTCard({ nft, selected, onToggle, metadata }: NFTCardProps) {
  const actionPoints = getTraitNumber(metadata, 'Action Points');
  const customized = isCustomized(metadata);
  const accessory = notableAccessory(metadata);

  return (
    <button
      onClick={onToggle}
      className={`relative overflow-hidden border transition-colors cursor-pointer ${
        selected
          ? 'border-2 border-normies-dark dark:border-normies-light bg-normies-dark/5 dark:bg-normies-light/5'
          : 'border-normies-dark dark:border-normies-light hover:bg-normies-dark/5 dark:hover:bg-normies-light/5'
      }`}
    >
      {nft.image_url ? (
        <img
          src={nft.image_url}
          alt={nft.name || `#${nft.identifier}`}
          className="w-full aspect-square object-cover"
        />
      ) : (
        <div className="w-full aspect-square flex items-center justify-center text-xs uppercase tracking-wider opacity-40">
          No Image
        </div>
      )}

      <div className="p-2 text-xs uppercase tracking-wider border-t border-normies-dark dark:border-normies-light space-y-1">
        <div className="text-center">#{nft.identifier}</div>
        {metadata && (
          <div className="flex flex-wrap items-center justify-center gap-1 text-[9px] opacity-60">
            {metadata.rank && <span>R#{metadata.rank}</span>}
            <span>AP {actionPoints}</span>
            {customized && <span>Custom</span>}
            {accessory && (
              <span className="max-w-full truncate" title={accessory}>
                {accessory}
              </span>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-normies-dark dark:bg-normies-light flex items-center justify-center">
          <svg className="w-3 h-3 text-normies-light dark:text-normies-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}
