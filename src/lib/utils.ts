import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function workExperienceDuration(from: string = "2023-01") {
  const match = /^(\d{4})-(\d{1,2})/.exec(from.trim());
  const startYear = match ? parseInt(match[1], 10) : 2023;
  const startMonth = match
    ? Math.min(12, Math.max(1, parseInt(match[2], 10)))
    : 1;

  const now = new Date();
  const totalMonths = Math.max(
    0,
    (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMonth),
  );

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0 && months === 0) return "Less than a month";
  if (years === 0) return `${months} month${months === 1 ? "" : "s"}`;
  if (months === 0) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years} year${years === 1 ? "" : "s"} ${months} month${months === 1 ? "" : "s"}`;
}
