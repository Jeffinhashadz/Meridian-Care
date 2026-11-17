/**
 * Primary action control — 44px min height, soft radius, clear focus.
 */
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-signal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-11 px-4',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-signal shadow-soft',
        secondary: 'bg-white text-ink border border-line hover:border-primary-signal/40',
        ghost: 'bg-transparent text-muted hover:bg-line/60 hover:text-ink',
        danger: 'bg-[#FBE0DA] text-[#A12A18] hover:bg-[#f5d0c8]',
      },
      size: {
        default: 'min-h-11 px-4',
        sm: 'min-h-9 px-3 text-xs rounded-[10px]',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
