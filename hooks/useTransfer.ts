'use client';

import { useState, useMemo, useCallback } from 'react';
import type { NFT } from '@/types/nft';
import { useEthersSigner } from '@/lib/ethersAdapter';
import { createSeaportClient, createGiftOrder, fulfillGiftOrder } from '@/lib/seaport';
import { useAccount } from 'wagmi';

export type TransferStatus =
  | { phase: 'idle' }
  | { phase: 'signing'; current: number; total: number }
  | { phase: 'confirming'; txHash: string }
  | { phase: 'success'; txHash: string }
  | { phase: 'error'; error: string };

type RecipientMap = Map<string, string>; // tokenId -> recipient address

function parseError(err: unknown): string {
  if (!(err instanceof Error)) return 'Something went wrong';

  const msg = err.message;

  // User rejected in wallet
  if (msg.includes('ACTION_REJECTED') || msg.includes('user rejected') || msg.includes('User denied') || msg.includes('4001')) {
    return 'Transaction rejected in wallet';
  }

  // Insufficient funds
  if (msg.includes('insufficient funds') || msg.includes('INSUFFICIENT_FUNDS')) {
    return 'Insufficient ETH for gas fees';
  }

  // Seaport: InvalidTime
  if (msg.includes('InvalidTime') || msg.includes('21ccfeb7')) {
    return 'Order timing error — please try again';
  }

  // Execution reverted
  if (msg.includes('execution reverted') || msg.includes('CALL_EXCEPTION')) {
    return 'Transaction would fail on-chain — check approval and ownership';
  }

  // Network errors
  if (msg.includes('network') || msg.includes('NETWORK_ERROR') || msg.includes('timeout')) {
    return 'Network error — check your connection and try again';
  }

  // Fallback: truncate long messages
  if (msg.length > 120) {
    return msg.slice(0, 120) + '...';
  }

  return msg;
}

export function useTransfer() {
  const signer = useEthersSigner();
  const { address } = useAccount();
  const [status, setStatus] = useState<TransferStatus>({ phase: 'idle' });

  const seaport = useMemo(() => {
    if (!signer) return undefined;
    return createSeaportClient(signer);
  }, [signer]);

  const sendAllToOne = useCallback(
    async (selectedNFTs: NFT[], recipient: string) => {
      if (!seaport || !address) return;

      try {
        setStatus({ phase: 'signing', current: 1, total: 1 });

        const tokenIds = selectedNFTs.map((nft) => nft.identifier);
        const order = await createGiftOrder(seaport, tokenIds, address);

        setStatus({ phase: 'confirming', txHash: '' });

        const tx = await fulfillGiftOrder(seaport, order, recipient, address) as unknown as { hash: string; wait: () => Promise<unknown> };

        setStatus({ phase: 'confirming', txHash: tx.hash });
        await tx.wait();

        setStatus({ phase: 'success', txHash: tx.hash });
      } catch (err: unknown) {
        setStatus({ phase: 'error', error: parseError(err) });
      }
    },
    [seaport, address]
  );

  const sendToMultiple = useCallback(
    async (selectedNFTs: NFT[], recipientMap: RecipientMap) => {
      if (!seaport || !address) return;

      try {
        // Group NFTs by recipient
        const grouped = new Map<string, string[]>();
        for (const nft of selectedNFTs) {
          const recipient = recipientMap.get(nft.identifier);
          if (!recipient) continue;
          const existing = grouped.get(recipient) || [];
          existing.push(nft.identifier);
          grouped.set(recipient, existing);
        }

        const entries = Array.from(grouped.entries());
        let lastTxHash = '';

        for (let i = 0; i < entries.length; i++) {
          const [recipient, tokenIds] = entries[i];

          setStatus({ phase: 'signing', current: i + 1, total: entries.length });

          const order = await createGiftOrder(seaport, tokenIds, address);

          setStatus({ phase: 'confirming', txHash: '' });

          const tx = await fulfillGiftOrder(seaport, order, recipient, address) as unknown as { hash: string; wait: () => Promise<unknown> };

          setStatus({ phase: 'confirming', txHash: tx.hash });
          await tx.wait();

          lastTxHash = tx.hash;
        }

        setStatus({ phase: 'success', txHash: lastTxHash });
      } catch (err: unknown) {
        setStatus({ phase: 'error', error: parseError(err) });
      }
    },
    [seaport, address]
  );

  const reset = useCallback(() => setStatus({ phase: 'idle' }), []);

  return { status, sendAllToOne, sendToMultiple, reset, ready: !!seaport };
}
