import { querySearchIndex, clearSearchIndex } from "@/lib/search";
import type { SearchResult } from "@/types/search";
import type { ImmerSet } from "./types";

export interface SearchSlice {
  searchQuery: string;
  searchResults: SearchResult[];
  activeTags: string[];
  isSearching: boolean;

  setSearchQuery: (query: string) => void;
  runSearch: (query: string) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  clearSearch: () => void;
  resetSearchIndex: () => void;
}

export const createSearchSlice = (set: ImmerSet): SearchSlice => ({
  searchQuery: "",
  searchResults: [],
  activeTags: [],
  isSearching: false,

  setSearchQuery: (query: string) => {
    set((state) => {
      state.searchQuery = query;
      state.isSearching = query.trim().length > 0;
    });
  },

  runSearch: (query: string) => {
    const results = querySearchIndex(query);
    set((state) => {
      state.searchResults = results;
      state.isSearching = false;
    });
  },

  toggleTag: (tag: string) => {
    set((state) => {
      const idx = state.activeTags.indexOf(tag);
      if (idx === -1) {
        state.activeTags.push(tag);
      } else {
        state.activeTags.splice(idx, 1);
      }
    });
  },

  clearTags: () => {
    set((state) => {
      state.activeTags = [];
    });
  },

  clearSearch: () => {
    set((state) => {
      state.searchQuery = "";
      state.searchResults = [];
      state.isSearching = false;
    });
  },

  resetSearchIndex: () => {
    clearSearchIndex();
    set((state) => {
      state.searchResults = [];
      state.searchQuery = "";
      state.activeTags = [];
    });
  },
});
