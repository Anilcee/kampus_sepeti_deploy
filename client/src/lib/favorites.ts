const FAVORITES_KEY = "favorites";

export type FavoriteId = string;

function readFavorites(): FavoriteId[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FavoriteId[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: FavoriteId[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(new Set(ids))));
  // Bildirmek için custom event yayınla
  window.dispatchEvent(new CustomEvent("favorites:changed", { detail: { count: ids.length } }));
}

export function getFavorites(): FavoriteId[] {
  return readFavorites();
}

export function isFavorite(id: FavoriteId): boolean {
  return readFavorites().includes(id);
}

export function addFavorite(id: FavoriteId): void {
  const current = readFavorites();
  if (!current.includes(id)) {
    writeFavorites([...current, id]);
  }
}

export function removeFavorite(id: FavoriteId): void {
  writeFavorites(readFavorites().filter((x) => x !== id));
}

export function toggleFavorite(id: FavoriteId): boolean {
  const current = readFavorites();
  if (current.includes(id)) {
    writeFavorites(current.filter((x) => x !== id));
    return false;
  }
  writeFavorites([...current, id]);
  return true;
}

export function favoritesCount(): number {
  return readFavorites().length;
}



