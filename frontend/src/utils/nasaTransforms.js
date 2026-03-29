export function buildApodSummary(apod) {
  if (!apod?.explanation) {
    return 'No APOD explanation available.';
  }

  const compact = apod.explanation.replace(/\s+/g, ' ').trim();
  if (compact.length <= 220) {
    return compact;
  }

  return `${compact.slice(0, 220)}...`;
}

export function flattenAsteroids(neoMap = {}) {
  return Object.entries(neoMap).flatMap(([date, asteroids]) =>
    asteroids.map((asteroid) => {
      const approach = asteroid.close_approach_data?.[0] || {};
      return {
        id: asteroid.id,
        date,
        name: asteroid.name,
        diameterKm:
          asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0,
        missDistanceKm: Number(approach.miss_distance?.kilometers || 0),
        relativeVelocityKph: Number(approach.relative_velocity?.kilometers_per_hour || 0),
      };
    }),
  );
}

export function asteroidCountsByDate(neoMap = {}) {
  return Object.entries(neoMap).map(([date, items]) => ({
    date,
    count: items.length,
  }));
}
