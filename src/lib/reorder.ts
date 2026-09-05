export type Ordered = {
  slug: string;
  display_order?: number;
};

function canonicalOrder<T extends Ordered>(list: T[]): T[] {
  return [...list].sort(
    (a, b) =>
      (a.display_order ?? Number.MAX_SAFE_INTEGER) -
      (b.display_order ?? Number.MAX_SAFE_INTEGER),
  );
}

export function orderedPosition<T extends Ordered>(
  list: T[],
  slug: string,
): number {
  return canonicalOrder(list).findIndex((item) => item.slug === slug);
}

export function orderedCount<T extends Ordered>(list: T[]): number {
  return list.length;
}

export function moveAndRenumber<T extends Ordered>(
  list: T[],
  slug: string,
  dir: -1 | 1,
): T[] | null {
  const ordered = canonicalOrder(list);
  const idx = ordered.findIndex((item) => item.slug === slug);
  const next = idx + dir;
  if (idx < 0 || next < 0 || next >= ordered.length) return null;
  const [moved] = ordered.splice(idx, 1);
  ordered.splice(next, 0, moved);
  return ordered.map((item, i) => ({ ...item, display_order: i }));
}

export function nextOrder<T extends Ordered>(list: T[]): number {
  if (list.length === 0) return 0;
  return (
    Math.max(...list.map((item) => item.display_order ?? 0)) + 1
  );
}
