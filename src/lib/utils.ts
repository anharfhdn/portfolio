import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function workExperienceDuration() {
  const duration = new Date().getFullYear() - 2023;
  return duration + "+";
}
