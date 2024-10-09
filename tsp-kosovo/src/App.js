import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import cities from './cities';
import 'leaflet/dist/leaflet.css';

// Define the custom icon
const customIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
  shadowSize: [41, 41]
});

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Function to calculate the total distance of a given path
const totalDistance = (path) => {
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    distance += calculateDistance(
      path[i].lat,
      path[i].lon,
      path[i + 1].lat,
      path[i + 1].lon
    );
  }
  distance += calculateDistance(
    path[path.length - 1].lat,
    path[path.length - 1].lon,
    path[0].lat,
    path[0].lon
  ); // Return to the starting city
  return distance;
};

// Function to create initial population
const createInitialPopulation = (cities, populationSize) => {
  const population = [];
  for (let i = 0; i < populationSize; i++) {
    population.push(shuffle([...cities]));
  }
  return population;
};

// Shuffle function for creating random paths
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Genetic Algorithm Main Process
const geneticAlgorithm = (cities, populationSize, generations) => {
  let population = createInitialPopulation(cities, populationSize);
  for (let generation = 0; generation < generations; generation++) {
    population.sort((a, b) => totalDistance(a) - totalDistance(b)); // Sort by shortest path
    const newPopulation = population.slice(0, populationSize / 2); // Keep the best half

    // Crossover and mutation
    while (newPopulation.length < populationSize) {
      const parent1 = newPopulation[Math.floor(Math.random() * (populationSize / 2))];
      const parent2 = newPopulation[Math.floor(Math.random() * (populationSize / 2))];
      const child = crossover(parent1, parent2);
      mutate(child);
      newPopulation.push(child);
    }

    population = newPopulation;
  }
  population.sort((a, b) => totalDistance(a) - totalDistance(b));
  return population[0]; // Return the best solution
};

// Crossover function (simple ordered crossover)
const crossover = (parent1, parent2) => {
  const start = Math.floor(Math.random() * parent1.length);
  const end = Math.floor(Math.random() * (parent1.length - start)) + start;
  const child = parent1.slice(start, end);
  parent2.forEach((city) => {
    if (!child.includes(city)) child.push(city);
  });
  return child;
};

// Mutation function (swap two cities randomly)
const mutate = (path) => {
  const i = Math.floor(Math.random() * path.length);
  const j = Math.floor(Math.random() * path.length);
  [path[i], path[j]] = [path[j], path[i]];
};

// Main React Component
function App() {
  const [bestPath, setBestPath] = useState([]);

  useEffect(() => {
    const result = geneticAlgorithm(cities, 100, 1000); // 100 population, 1000 generations
    setBestPath(result);
  }, []);

  return (
    <div>
      <h1>Traveling Salesman Problem - Kosovo</h1>
      <MapContainer center={[42.6629, 21.1655]} zoom={8} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Display cities on the map */}
        {cities.map((city, index) => (
          <Marker 
            key={index} 
            position={[city.lat, city.lon]} 
            icon={customIcon} 
          />
        ))}
        {/* Draw the optimized path */}
        <Polyline positions={bestPath.map(city => [city.lat, city.lon])} />
      </MapContainer>
    </div>
  );
}

export default App;
