import { cn } from '../../utils/cn';
import type { Habit } from '../../types';

interface HabitDotProps {
  habit: Habit;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HabitDot({ habit, size = 'md', className }: HabitDotProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full flex-shrink-0',
        {
          'w-2 h-2': size === 'sm',
          'w-2.5 h-2.5': size === 'md',
          'w-3.5 h-3.5': size === 'lg',
        },
        className
      )}
      style={{ backgroundColor: habit.color }}
      title={habit.name}
    />
  );
}
