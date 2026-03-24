'use client';

import { useConduitApproval } from '@/hooks/useConduitApproval';

export function ApprovalButton() {
  const { isApproved, isChecking, approve, isApproving } = useConduitApproval();

  if (isChecking) {
    return (
      <p className="text-xs uppercase tracking-wider opacity-40 animate-pulse">
        Checking approval...
      </p>
    );
  }

  if (isApproved) {
    return (
      <p className="text-xs uppercase tracking-wider opacity-60">
        Conduit Approved
      </p>
    );
  }

  return (
    <button
      onClick={approve}
      disabled={isApproving}
      className="border-2 border-normies-dark dark:border-normies-light px-6 py-3 text-xs uppercase tracking-widest
        hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker transition-colors
        disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    >
      {isApproving ? 'Approving...' : 'Approve Transfer'}
    </button>
  );
}
