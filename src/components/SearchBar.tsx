import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, X } from 'lucide-react';
import { weatherApi } from '../utils/weatherApi';
import { storageUtils } from '../utils/storage';
import { LoadingSpinner } from './LoadingSpinner';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; country: string; lat: number; lon: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(storageUtils.getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCities = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await weatherApi.searchCities(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('Error searching cities:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    
    if (value.trim()) {
      searchCities(value.trim());
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      storageUtils.addRecentSearch(searchTerm.trim());
      setRecentSearches(storageUtils.getRecentSearches());
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: { name: string; country: string }) => {
    const searchTerm = `${suggestion.name}, ${suggestion.country}`;
    handleSearch(searchTerm);
  };

  const handleRecentSearchClick = (search: string) => {
    handleSearch(search);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('weather-recent-searches');
    setRecentSearches([]);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for a city or country..."
            className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm border border-white/30 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </form>

      {showSuggestions && (query.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700 shadow-xl z-50 max-h-80 overflow-y-auto">
          {query.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Search Results
                </h3>
                {isSearching && <LoadingSpinner size="sm" />}
              </div>
              
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {suggestion.name}, {suggestion.country}
                      </span>
                    </button>
                  ))}
                </div>
              ) : !isSearching && query.length >= 2 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No cities found for "{query}"
                </p>
              )}
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </div>
              
              <div className="space-y-2">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {search}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};