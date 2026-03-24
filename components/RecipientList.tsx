'use client';

import { useCallback } from 'react';
import type { NFT } from '@/types/nft';
import { AddressInput } from './AddressInput';

interface RecipientListProps {
  selectedNFTs: NFT[];
  recipientMap: Map<string, string>;
  onRecipientChange: (tokenId: string, raw: string) => void;
  onRecipientResolved: (tokenId: string, address: string | null) => void;
}

function RecipientRow({
  nft,
  value,
  onChangeRaw,
  onResolved,
}: {
  nft: NFT;
  value: string;
  onChangeRaw: (raw: string) => void;
  onResolved: (address: string | null) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 border border-normies-dark dark:border-normies-light overflow-hidden mt-1">
        {nft.image_url ? (
          <img src={nft.image_url} alt={`#${nft.identifier}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] uppercase opacity-40">
            {nft.identifier}
          </div>
        )}
      </div>
      <span className="text-xs uppercase tracking-wider w-16 flex-shrink-0 mt-3">
        #{nft.identifier}
      </span>
      <AddressInput
        value={value}
        onChange={onChangeRaw}
        onResolved={onResolved}
        className="!py-2 !px-3"
      />
    </div>
  );
}

export function RecipientList({ selectedNFTs, recipientMap, onRecipientChange, onRecipientResolved }: RecipientListProps) {
  return (
    <div className="space-y-3">
      <label className="block text-xs uppercase tracking-wider opacity-60">
        Recipient for each NFT
      </label>
      {selectedNFTs.map((nft) => (
        <RecipientRow
          key={nft.identifier}
          nft={nft}
          value={recipientMap.get(nft.identifier) || ''}
          onChangeRaw={useCallback((raw: string) => onRecipientChange(nft.identifier, raw), [onRecipientChange, nft.identifier])}
          onResolved={useCallback((addr: string | null) => onRecipientResolved(nft.identifier, addr), [onRecipientResolved, nft.identifier])}
        />
      ))}
    </div>
  );
}
