import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUSCoordinates(count: number): { lat: number; lng: number }[] {
  const coords: { lat: number; lng: number }[] = [];

  while (coords.length < count) {
    const lng = Math.random() * (-75 - -120) + -123;

    // Interpolate latitude bounds based on longitude
    let minLat, maxLat;
    if (lng < -110) {
      // Western US: 25–49 latitude
      minLat = 37;
      maxLat = 47;
    } else {
      // Eastern US: 30–45 latitude
      minLat = 32;
      maxLat = 42;
    }

    const lat = Math.random() * (maxLat - minLat) + minLat;
    coords.push({ lat, lng });
  }

  return coords;
}
