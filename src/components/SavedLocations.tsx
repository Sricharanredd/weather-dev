import React, { useState, useEffect } from "react";
import { MapPin, Trash2, Plus } from "lucide-react";
import { SavedLocation } from "../types/weather";
import { storageUtils } from "../utils/storage";

interface SavedLocationsProps {
  onLocationSelect: (location: string) => void;
  currentLocation?: string;
}

export const SavedLocations: React.FC<SavedLocationsProps> = ({
  onLocationSelect,
  currentLocation,
}) => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setSavedLocations(storageUtils.getSavedLocations());
  }, []);

  const handleRemoveLocation = (id: string) => {
    storageUtils.removeSavedLocation(id);
    setSavedLocations(storageUtils.getSavedLocations());
  };

  const handleAddCurrentLocation = () => {
    if (currentLocation) {
      const [name, country] = currentLocation.split(", ");
      storageUtils.addSavedLocation({
        name: name || currentLocation,
        country: country || "",
        lat: 0,
        lon: 0,
      });
      setSavedLocations(storageUtils.getSavedLocations());
    }
  };

  const displayedLocations = showAll
    ? savedLocations
    : savedLocations.slice(0, 6);

  if (savedLocations.length === 0) {
    return (
      <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30 dark:border-gray-700 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Locations Saveds
            </h2>
          </div>

          {currentLocation && (
            <button
              onClick={handleAddCurrentLocation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Save Currents
            </button>
          )}
        </div>

        <div className="text-center py-8">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No saved locations yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Search for a city and save it for quick access
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-white/30 dark:border-gray-700 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Saved Locations
          </h2>
        </div>

        {currentLocation && (
          <button
            onClick={handleAddCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Save Current
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedLocations.map((location) => (
          <div
            key={location.id}
            className="bg-white/10 dark:bg-gray-700/30 rounded-2xl p-4 hover:bg-white/20 dark:hover:bg-gray-700/40 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <button
                onClick={() =>
                  onLocationSelect(`${location.name}, ${location.country}`)
                }
                className="flex-1 text-left"
              >
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {location.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {location.country}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Added {new Date(location.addedAt).toLocaleDateString()}
                </div>
              </button>

              <button
                onClick={() => handleRemoveLocation(location.id)}
                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove location"
                aria-label="Remove location"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {savedLocations.length > 6 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {showAll ? "Show Less" : `Show All (${savedLocations.length})`}
          </button>
        </div>
      )}
    </div>
  );
};
