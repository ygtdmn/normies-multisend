'use client';

import { AddressInput } from './AddressInput';

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
  onResolved: (address: string | null) => void;
}

export function RecipientInput({ value, onChange, onResolved }: RecipientInputProps) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider opacity-60 mb-2">
        Recipient Address
      </label>
      <AddressInput value={value} onChange={onChange} onResolved={onResolved} />
    </div>
  );
}
