import { useEffect, useState, useCallback } from 'react';

type Coords = { lat: number; lng: number; accuracy?: number } | null;

export function useGeolocation(options?: PositionOptions) {
  const [coords, setCoords] = useState<Coords>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check cache/permission
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

  // Monitor Permission Changes
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state);
        result.onchange = () => {
          setPermissionState(result.state);
        };
      });
    }
  }, []);

  const getPosition = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude, 
          accuracy: pos.coords.accuracy 
        };
        setCoords(c);
        setIsLoading(false);
        // Cache location
        try { localStorage.setItem('userCoords', JSON.stringify(c)); } catch (e) {}
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      options
    );
  }, [options]);

  useEffect(() => {
    // Try to load cached coords first
    try {
      const raw = localStorage.getItem('userCoords');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.lat) setCoords(parsed);
      }
    } catch (e) {}

    // Auto-detect on mount
    getPosition();
  }, [getPosition]);

  // FIX: Added permissionState to return object
  return { coords, error, isLoading, getPosition, permissionState } as const;
}