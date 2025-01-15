import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodePrompt(prompt: string) {
  return encodeURIComponent(prompt)
}

export function decodePrompt(encoded: string) {
  return decodeURIComponent(encoded)
}

