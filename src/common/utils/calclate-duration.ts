//This is the Haversine formula, which calculates the great-circle distance between two points on a sphere. "Great-circle" means the shortest path along the surface of the sphere (like an airplane route)
//Used in ordersService
export function calculateEstimatedDuration(
  pickup: [number, number],
  delivery: [number, number],
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const lat1 = toRadians(pickup[0]);
  const lat2 = toRadians(delivery[0]);
  const deltaLat = toRadians(delivery[0] - pickup[0]);
  const deltaLon = toRadians(delivery[1] - pickup[1]);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.ceil((distance / 30) * 60); // Assuming 30 km/h average speed
}
