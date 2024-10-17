import { calculateDistance } from './geneticAlgorithm';

export const approximationAlgorithm = (cities) => {
  if (cities.length === 0) return [];

  const remainingCities = [...cities];
  const path = [];
  let currentCity = remainingCities.shift(); // Merr qytetin e parë
  path.push(currentCity); // Shto në rrugë

  while (remainingCities.length > 0) {
    let nearestCity = remainingCities[0];
    let nearestDistance = calculateDistance(
      currentCity.lat,
      currentCity.lon,
      nearestCity.lat,
      nearestCity.lon
    );

    for (let city of remainingCities) {
      const distance = calculateDistance(
        currentCity.lat,
        currentCity.lon,
        city.lat,
        city.lon
      );
      if (distance < nearestDistance) {
        nearestCity = city;
        nearestDistance = distance;
      }
    }

    path.push(nearestCity);
    currentCity = nearestCity;
    remainingCities.splice(remainingCities.indexOf(nearestCity), 1); // Hiqe qytetin e vizituar
  }

  // Rikthehu te qyteti i parë për të mbyllur rrugën
  path.push(path[0]);

  return path;
};
