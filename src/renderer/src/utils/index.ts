import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const dateFormatter = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'UTC'
})

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args))
}

export const formatDateFormMs = (ms: number) => dateFormatter.format(ms)
