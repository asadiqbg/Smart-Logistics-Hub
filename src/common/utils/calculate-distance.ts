export function calculateDistance(point1: any, point2: any): number {
  if (!point1 || !point2) return Infinity;

  const [lon1, lat1] = point1.coordinates || [0, 0];
  const [lon2, lat2] = point2.coordinates || [0, 0];

  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
