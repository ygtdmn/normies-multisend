'use client';

import type { TransferStatus } from '@/hooks/useTransfer';

interface TransactionStatusProps {
  status: TransferStatus;
  onReset: () => void;
}

export function TransactionStatus({ status, onReset }: TransactionStatusProps) {
  if (status.phase === 'idle') return null;

  return (
    <div className="border border-normies-dark dark:border-normies-light p-4">
      {status.phase === 'signing' && (
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-normies-dark dark:border-normies-light border-t-transparent animate-spin" />
          <span className="text-xs uppercase tracking-wider">
            Signing order {status.current} of {status.total}...
          </span>
        </div>
      )}

      {status.phase === 'confirming' && (
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-normies-dark dark:border-normies-light border-t-transparent animate-spin" />
          <span className="text-xs uppercase tracking-wider">
            Confirming transaction...
          </span>
        </div>
      )}

      {status.phase === 'success' && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider">
            Transfer successful
          </p>
          <div className="flex gap-3">
            <a
              href={`https://etherscan.io/tx/${status.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-normies-dark dark:border-normies-light px-3 py-1.5 text-xs uppercase tracking-wider
                hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker transition-colors"
            >
              View on Etherscan
            </a>
            <button
              onClick={onReset}
              className="border border-normies-dark dark:border-normies-light px-3 py-1.5 text-xs uppercase tracking-wider
                hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker transition-colors cursor-pointer"
            >
              Send more
            </button>
          </div>
        </div>
      )}

      {status.phase === 'error' && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider">Transfer failed</p>
          <p className="text-xs opacity-60 break-all">{status.error}</p>
          <button
            onClick={onReset}
            className="border border-normies-dark dark:border-normies-light px-3 py-1.5 text-xs uppercase tracking-wider
              hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
