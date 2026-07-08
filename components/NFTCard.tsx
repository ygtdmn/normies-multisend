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
  const pixelCount = getTraitNumber(metadata, 'Pixel Count');
  const customized = isCustomized(metadata);
  const accessory = notableAccessory(metadata);
  const rankLabel = metadata?.rank ? `#${metadata.rank}` : '—';
  const actionLabel = metadata ? String(actionPoints) : '—';
  const pixelLabel = metadata ? String(pixelCount) : '—';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative cursor-pointer border p-2 text-left transition-[background-color,border-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(72,73,75,0.12)] active:translate-y-px dark:hover:shadow-[0_6px_20px_rgba(227,229,228,0.12)] ${
        selected
          ? 'border-normies-dark bg-normies-dark/[0.08] dark:border-normies-light dark:bg-normies-light/[0.08]'
          : 'border-normies-dark/30 bg-normies-dark/[0.025] hover:border-normies-dark/75 hover:bg-normies-dark/[0.045] dark:border-normies-light/30 dark:bg-normies-light/[0.025] dark:hover:border-normies-light/75 dark:hover:bg-normies-light/[0.045]'
      }`}
      aria-pressed={selected}
    >
      {selected && (
        <div className="absolute right-2 top-2 z-10 h-3 w-3 border border-normies-light bg-normies-dark shadow-[0_0_0_1px_rgba(72,73,75,0.5)] dark:border-normies-darker dark:bg-normies-light dark:shadow-[0_0_0_1px_rgba(227,229,228,0.5)]" />
      )}

      <div className="aspect-square overflow-hidden border border-normies-dark/15 bg-normies-light p-2 transition-colors group-hover:border-normies-dark/35 dark:border-normies-light/15 dark:group-hover:border-normies-light/35">
        {nft.image_url ? (
          <img
            src={nft.image_url}
            alt={nft.name || `#${nft.identifier}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wider opacity-40">
            No Image
          </div>
        )}
      </div>

      <div className="mt-2 border-t border-normies-dark/15 pt-2 dark:border-normies-light/15">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-robotastic text-sm uppercase tracking-[0.08em] opacity-85">
            #{nft.identifier}
          </span>
          <span className="border border-normies-dark/40 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums opacity-90 dark:border-normies-light/40">
            {rankLabel}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          <span className={metaChipClassName}>{actionLabel} AP</span>
          <span className={metaChipClassName}>{pixelLabel} PX</span>
          {customized && <span className={metaChipClassName}>Customized</span>}
          {accessory && (
            <span className={`${metaChipClassName} max-w-full truncate`} title={accessory}>
              {accessory}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

const metaChipClassName =
  'border border-normies-dark/20 bg-normies-dark/[0.035] px-1.5 py-0.5 text-[9px] uppercase tracking-widest opacity-70 dark:border-normies-light/20 dark:bg-normies-light/[0.035]';
