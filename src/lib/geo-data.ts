export const CITY_COORDS: Record<string, [number, number]> = {
  tunis: [36.8065, 10.1815],
  "ben arous": [36.7533, 10.2189],
  "tunis-carthage": [36.851, 10.2272],
  sfax: [34.7406, 10.7603],
  "les berges du lac": [36.8402, 10.2617],
  bizerte: [37.2744, 9.8739],
  hammamet: [36.4, 10.6167],
  sousse: [35.8256, 10.6084],
};

export function cityCoords(city: string): [number, number] {
  return CITY_COORDS[city.trim().toLowerCase()] ?? CITY_COORDS.tunis;
}

/** OpenStreetMap embed URL centred on a city, with an optional marker. */
export function osmEmbed(city: string, zoomSpan = 0.02) {
  const [lat, lon] = cityCoords(city);
  const bbox = [lon - zoomSpan, lat - zoomSpan / 2, lon + zoomSpan, lat + zoomSpan / 2].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

export function osmLink(city: string) {
  const [lat, lon] = cityCoords(city);
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`;
}
