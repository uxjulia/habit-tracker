import { PRESET_COLORS } from '../../utils/colors';
import { cn } from '../../utils/cn';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Color</label>
      <div className="flex flex-wrap gap-2 items-center">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              'w-7 h-7 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500',
              value === color ? 'ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-100 scale-110' : 'hover:scale-105'
            )}
            style={{ backgroundColor: color }}
            aria-label={color}
          />
        ))}
        {/* Custom color */}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
            id="custom-color"
          />
          <label
            htmlFor="custom-color"
            className={cn(
              'w-7 h-7 rounded-full border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center cursor-pointer hover:border-zinc-600 dark:hover:border-zinc-400 transition-colors',
              !PRESET_COLORS.includes(value) && 'border-solid ring-2 ring-offset-2 ring-zinc-900 dark:ring-zinc-100 scale-110'
            )}
            style={{ backgroundColor: !PRESET_COLORS.includes(value) ? value : 'transparent' }}
          >
            {PRESET_COLORS.includes(value) && (
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
