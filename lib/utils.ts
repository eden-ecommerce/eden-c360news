import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes — use for every `className`. See PROJECT_RULES.md → Styling. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
