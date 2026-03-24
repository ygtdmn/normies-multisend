'use client';

import { useEffect } from 'react';
import { isAddress } from 'viem';
import { useEnsAddress } from 'wagmi';

interface AddressInputProps {
  value: string;
  onChange: (raw: string) => void;
  onResolved: (address: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function AddressInput({ value, onChange, onResolved, placeholder = '0x... or ENS name', className }: AddressInputProps) {
  const isEns = !!value && !isAddress(value) && value.includes('.');
  const isRawValid = !!value && isAddress(value);

  const { data: ensAddress, isLoading: isResolving } = useEnsAddress({
    name: isEns ? value : undefined,
  });

  // Notify parent of resolved address
  useEffect(() => {
    if (isRawValid) {
      onResolved(value);
    } else if (isEns && ensAddress) {
      onResolved(ensAddress);
    } else {
      onResolved(null);
    }
  }, [value, isRawValid, isEns, ensAddress, onResolved]);

  const hasError = !!value && !isRawValid && !isEns;
  const ensNotFound = isEns && !isResolving && !ensAddress;

  return (
    <div className="flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-transparent border text-sm outline-none transition-colors ${
          hasError || ensNotFound
            ? 'border-red-500'
            : 'border-normies-dark dark:border-normies-light'
        } ${className ?? ''}`}
      />
      {isResolving && (
        <p className="mt-1 text-xs uppercase tracking-wider opacity-40 animate-pulse">
          Resolving ENS...
        </p>
      )}
      {isEns && ensAddress && (
        <p className="mt-1 text-xs uppercase tracking-wider opacity-60 truncate">
          {ensAddress}
        </p>
      )}
      {ensNotFound && (
        <p className="mt-1 text-xs uppercase tracking-wider text-red-500">
          ENS name not found
        </p>
      )}
      {hasError && (
        <p className="mt-1 text-xs uppercase tracking-wider text-red-500">
          Invalid address
        </p>
      )}
    </div>
  );
}
