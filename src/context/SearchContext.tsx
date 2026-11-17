/** Top-bar search string shared with the active page for client-side filtering. */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const SearchContext = createContext<{
  query: string;
  setQuery: (q: string) => void;
} | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const value = useMemo(() => ({ query, setQuery }), [query]);
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
