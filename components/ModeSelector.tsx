'use client';

export type SendMode = 'single' | 'multiple';

interface ModeSelectorProps {
  mode: SendMode;
  onChange: (mode: SendMode) => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="flex w-fit">
      <button
        onClick={() => onChange('single')}
        className={`px-4 py-2 border border-normies-dark dark:border-normies-light text-xs uppercase tracking-widest transition-colors cursor-pointer ${
          mode === 'single'
            ? 'bg-normies-dark text-normies-light dark:bg-normies-light dark:text-normies-darker'
            : 'hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker'
        }`}
      >
        All to One
      </button>
      <button
        onClick={() => onChange('multiple')}
        className={`px-4 py-2 border border-normies-dark dark:border-normies-light border-l-0 text-xs uppercase tracking-widest transition-colors cursor-pointer ${
          mode === 'multiple'
            ? 'bg-normies-dark text-normies-light dark:bg-normies-light dark:text-normies-darker'
            : 'hover:bg-normies-dark hover:text-normies-light dark:hover:bg-normies-light dark:hover:text-normies-darker'
        }`}
      >
        To Multiple
      </button>
    </div>
  );
}
