const STORAGE_KEY = 'wai_recent_searches';
const MAX_ITEMS = 8;

export const getRecentSearches = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (query) => {
  if (!query || !query.trim()) return;
  const searches = getRecentSearches().filter(
    (s) => s.toLowerCase() !== query.trim().toLowerCase()
  );
  searches.unshift(query.trim());
  if (searches.length > MAX_ITEMS) searches.length = MAX_ITEMS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
};

export const clearRecentSearches = () => {
  localStorage.removeItem(STORAGE_KEY);
};
