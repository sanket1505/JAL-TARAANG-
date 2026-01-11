import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

type Coords = { lat: number; lng: number; accuracy?: number } | null;

interface LocationContextType {
  coords: Coords;
  error: string | null;
  display: string;
  isLoading: boolean;
  permissionState?: PermissionState | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  // Prevent infinite loop by memoizing options
  const options = useMemo(() => ({ 
    enableHighAccuracy: true, 
    maximumAge: 0, 
    timeout: 10000 
  }), []);

  const { coords, error, isLoading: isGeoLoading, permissionState } = useGeolocation(options);
  const [locationName, setLocationName] = useState<string>('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Reverse Geocoding Effect: Converts Lat/Lng to Address
  useEffect(() => {
    if (coords) {
      setIsReverseGeocoding(true);
      
      // FIX: Added error handling for non-200 responses
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`)
        .then(res => {
            if (!res.ok) throw new Error("Reverse geocoding service unavailable");
            return res.json();
        })
        .then(data => {
          if (data && data.address) {
            // Extract relevant location parts
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || '';
            const state = data.address.state || '';
            const district = data.address.state_district || '';
            
            // Format: "City, State" or "District, State"
            const name = city ? `${city}, ${state}` : (district ? `${district}, ${state}` : state);
            setLocationName(name || 'Unknown Location');
          } else {
            // Fallback if address not found
            setLocationName(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
          }
        })
        .catch((err) => {
          console.error("Reverse geocoding failed", err);
          // Fallback on error
          setLocationName(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        })
        .finally(() => {
          setIsReverseGeocoding(false);
        });
    }
  }, [coords]);

  // Show loading if getting coords OR converting to address
  const isLoading = isGeoLoading || (!!coords && isReverseGeocoding && !locationName);

  // Use the fetched name, or coords, or empty string
  const display = locationName || (coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : '');

  return (
    <LocationContext.Provider value={{ coords, error, display, isLoading, permissionState }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}