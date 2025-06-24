import { SavedLocation } from '../types/weather';

const SAVED_LOCATIONS_KEY = 'weather-saved-locations';
const RECENT_SEARCHES_KEY = 'weather-recent-searches';

export const storageUtils = {
  getSavedLocations: (): SavedLocation[] => {
    const saved = localStorage.getItem(SAVED_LOCATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveSavedLocations: (locations: SavedLocation[]): void => {
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(locations));
  },

  addSavedLocation: (location: Omit<SavedLocation, 'id' | 'addedAt'>): void => {
    const saved = storageUtils.getSavedLocations();
    const newLocation: SavedLocation = {
      ...location,
      id: Date.now().toString(),
      addedAt: Date.now(),
    };
    
    const exists = saved.some(loc => 
      loc.name === location.name && loc.country === location.country
    );
    
    if (!exists) {
      saved.push(newLocation);
      storageUtils.saveSavedLocations(saved);
    }
  },

  removeSavedLocation: (id: string): void => {
    const saved = storageUtils.getSavedLocations();
    const filtered = saved.filter(loc => loc.id !== id);
    storageUtils.saveSavedLocations(filtered);
  },

  getRecentSearches: (): string[] => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  addRecentSearch: (search: string): void => {
    const searches = storageUtils.getRecentSearches();
    const filtered = searches.filter(s => s.toLowerCase() !== search.toLowerCase());
    filtered.unshift(search);
    const limited = filtered.slice(0, 10); // Keep only last 10 searches
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limited));
  },
};