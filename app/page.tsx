'use client';

import { useState, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Layout } from '@/components/Layout';
import { NFTGrid } from '@/components/NFTGrid';
import { ModeSelector, type SendMode } from '@/components/ModeSelector';
import { RecipientInput } from '@/components/RecipientInput';
import { RecipientList } from '@/components/RecipientList';
import { ApprovalButton } from '@/components/ApprovalButton';
import { TransactionStatus } from '@/components/TransactionStatus';
import { NFTFilters } from '@/components/NFTFilters';
import { useNFTs } from '@/hooks/useNFTs';
import { useRarityNormies } from '@/hooks/useRarityNormies';
import { useConduitApproval } from '@/hooks/useConduitApproval';
import { useTransfer } from '@/hooks/useTransfer';
import { createEmptyNormieFilters, filterNormieIds } from '@/lib/rarity';
import type { NFT } from '@/types/nft';

export default function Home() {
  const { isConnected } = useAccount();
  const { data: nfts, isLoading: nftsLoading, error: nftsError, refetch: refetchNFTs } = useNFTs();
  const { isApproved } = useConduitApproval();
  const { status, sendAllToOne, sendToMultiple, reset, ready } = useTransfer();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<SendMode>('single');
  const [filters, setFilters] = useState(createEmptyNormieFilters);

  // Single mode: raw input + resolved address
  const [recipientRaw, setRecipientRaw] = useState('');
  const [recipientResolved, setRecipientResolved] = useState<string | null>(null);

  // Multiple mode: raw inputs + resolved addresses
  const [recipientMap, setRecipientMap] = useState<Map<string, string>>(new Map());
  const [resolvedMap, setResolvedMap] = useState<Map<string, string>>(new Map());

  const toggleNFT = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 50) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const nftIds = useMemo(() => (nfts || []).map((nft) => nft.identifier), [nfts]);
  const { metadata, loading: metadataLoading, error: metadataError } = useRarityNormies(nftIds);
  const visibleIds = useMemo(
    () => filterNormieIds(nftIds, metadata, filters),
    [nftIds, metadata, filters],
  );
  const visibleIdSet = useMemo(() => new Set(visibleIds), [visibleIds]);
  const nftsById = useMemo(() => new Map((nfts || []).map((nft) => [nft.identifier, nft])), [nfts]);
  const visibleNFTs = useMemo(
    () => visibleIds.map((id) => nftsById.get(id)).filter((nft): nft is NFT => Boolean(nft)),
    [visibleIds, nftsById],
  );
  const hiddenSelectedIds = useMemo(
    () => [...selected].filter((id) => !visibleIdSet.has(id)),
    [selected, visibleIdSet],
  );

  const selectAll = useCallback(() => {
    setSelected(new Set(visibleNFTs.slice(0, 50).map((n) => n.identifier)));
  }, [visibleNFTs]);

  const deselectAll = useCallback(() => setSelected(new Set()), []);

  const deselectHidden = useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      hiddenSelectedIds.forEach((id) => next.delete(id));
      return next;
    });
  }, [hiddenSelectedIds]);

  const updateRecipientRaw = useCallback((tokenId: string, raw: string) => {
    setRecipientMap((prev) => {
      const next = new Map(prev);
      next.set(tokenId, raw);
      return next;
    });
  }, []);

  const updateRecipientResolved = useCallback((tokenId: string, address: string | null) => {
    setResolvedMap((prev) => {
      const next = new Map(prev);
      if (address) {
        next.set(tokenId, address);
      } else {
        next.delete(tokenId);
      }
      return next;
    });
  }, []);

  const selectedNFTs = useMemo(
    () => (nfts || []).filter((n) => selected.has(n.identifier)),
    [nfts, selected]
  );

  const canSend = useMemo(() => {
    if (
      !isApproved ||
      !ready ||
      selected.size === 0 ||
      status.phase !== 'idle' ||
      hiddenSelectedIds.length > 0
    ) {
      return false;
    }

    if (mode === 'single') {
      return !!recipientResolved;
    } else {
      return selectedNFTs.every((nft) => resolvedMap.has(nft.identifier));
    }
  }, [isApproved, ready, selected, status, hiddenSelectedIds, mode, recipientResolved, selectedNFTs, resolvedMap]);

  const handleReset = useCallback(() => {
    reset();
    setSelected(new Set());
    refetchNFTs();
  }, [reset, refetchNFTs]);

  const handleSend = useCallback(() => {
    if (!canSend) return;
    if (mode === 'single') {
      sendAllToOne(selectedNFTs, recipientResolved!);
    } else {
      // Build a Map<tokenId, resolvedAddress> for the transfer hook
      sendToMultiple(selectedNFTs, resolvedMap);
    }
  }, [canSend, mode, selectedNFTs, recipientResolved, resolvedMap, sendAllToOne, sendToMultiple]);

  return (
    <Layout>
      {!isConnected ? (
        <div className="text-center py-20 space-y-4">
          <h2 className="font-robotastic text-4xl md:text-5xl tracking-wider">
            MULTI-SEND
          </h2>
          <p className="text-xs uppercase tracking-[0.3em] opacity-60">
            Send multiple Normies NFTs using the OpenSea Conduit
          </p>
          <div className="border border-normies-dark dark:border-normies-light p-6 max-w-md mx-auto mt-8">
            <p className="text-sm uppercase tracking-wider opacity-60">
              Connect your wallet to get started
            </p>
          </div>
        </div>
      ) : nftsLoading ? (
        <div className="text-center py-20 space-y-4">
          <div className="w-4 h-4 border-2 border-normies-dark dark:border-normies-light border-t-transparent animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-wider opacity-40 animate-pulse">
            Loading your Normies...
          </p>
        </div>
      ) : nftsError ? (
        <div className="text-center py-20">
          <div className="border border-normies-dark dark:border-normies-light p-6 max-w-md mx-auto">
            <p className="text-sm uppercase tracking-wider">Failed to load NFTs</p>
            <p className="text-xs opacity-60 mt-2">{nftsError.message}</p>
          </div>
        </div>
      ) : !nfts || nfts.length === 0 ? (
        <div className="text-center py-20">
          <div className="border border-normies-dark dark:border-normies-light p-6 max-w-md mx-auto">
            <p className="text-sm uppercase tracking-wider opacity-60">
              You don&apos;t own any Normies NFTs
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <NFTFilters
            tokenIds={nftIds}
            metadata={metadata}
            filters={filters}
            onChange={setFilters}
            loading={metadataLoading}
            error={metadataError}
          />
          <NFTGrid
            nfts={visibleNFTs}
            totalCount={nfts.length}
            metadata={metadata}
            selected={selected}
            hiddenSelectedCount={hiddenSelectedIds.length}
            onToggle={toggleNFT}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onDeselectHidden={deselectHidden}
          />

          {selected.size > 0 && (
            <div className="space-y-6 border-t border-normies-dark dark:border-normies-light pt-8">
              <ModeSelector mode={mode} onChange={setMode} />

              {mode === 'single' ? (
                <RecipientInput
                  value={recipientRaw}
                  onChange={setRecipientRaw}
                  onResolved={setRecipientResolved}
                />
              ) : (
                <RecipientList
                  selectedNFTs={selectedNFTs}
                  recipientMap={recipientMap}
                  onRecipientChange={updateRecipientRaw}
                  onRecipientResolved={updateRecipientResolved}
                />
              )}

              <div className="flex items-center gap-6">
                <ApprovalButton />

                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="border-2 border-normies-dark dark:border-normies-light px-8 py-3 text-sm uppercase tracking-widest
                    hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker transition-colors
                    disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  {hiddenSelectedIds.length > 0
                    ? `${hiddenSelectedIds.length} Selected Hidden by Filters`
                    : `Send ${selected.size} NFT${selected.size !== 1 ? 's' : ''}`}
                </button>
              </div>

              <TransactionStatus status={status} onReset={handleReset} />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
