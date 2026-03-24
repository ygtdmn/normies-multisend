'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NORMIES_CONTRACT, OPENSEA_CONDUIT, ERC721_ABI } from '@/lib/contracts';

export function useConduitApproval() {
  const { address } = useAccount();

  const { data: isApproved, isLoading: isChecking, refetch } = useReadContract({
    address: NORMIES_CONTRACT,
    abi: ERC721_ABI,
    functionName: 'isApprovedForAll',
    args: address ? [address, OPENSEA_CONDUIT] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, data: txHash, isPending: isApproving } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Refetch approval status after confirmation
  if (isConfirmed) {
    refetch();
  }

  function approve() {
    writeContract({
      address: NORMIES_CONTRACT,
      abi: ERC721_ABI,
      functionName: 'setApprovalForAll',
      args: [OPENSEA_CONDUIT, true],
    });
  }

  return {
    isApproved: !!isApproved,
    isChecking,
    approve,
    isApproving: isApproving || isConfirming,
  };
}
