'use client';

import { useQuery } from '@tanstack/react-query';
import type { NFT, HoldersResponse } from '@/types/nft';
import { useAccount } from 'wagmi';

async function fetchNFTs(address: string): Promise<NFT[]> {
  const res = await fetch(`https://api.normies.art/holders/${address}`);
  if (!res.ok) {
    throw new Error('Failed to fetch NFTs');
  }
  const data: HoldersResponse = await res.json();
  return data.tokenIds.map((id) => ({
    identifier: id,
    image_url: `https://api.normies.art/normie/${id}/image.svg`,
  }));
}

export function useNFTs() {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['nfts', address],
    queryFn: () => fetchNFTs(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
  });
}
