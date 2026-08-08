interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
  emoji?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, sublabel, emoji, disabled }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors active:scale-[0.99] ${
        checked
          ? 'border-calm bg-calm/10'
          : 'border-border bg-surface'
      }`}
    >
      {emoji && <span className="text-2xl leading-none">{emoji}</span>}
      <span className="flex-1 min-w-0">
        <span className={`block font-bold ${checked ? 'text-ink-soft line-through' : 'text-ink'}`}>
          {label}
        </span>
        {sublabel && <span className="block text-sm text-ink-faint">{sublabel}</span>}
      </span>
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm ${
          checked ? 'border-calm bg-calm text-white' : 'border-ink-faint text-transparent'
        }`}
      >
        ✓
      </span>
    </button>
  );
}
