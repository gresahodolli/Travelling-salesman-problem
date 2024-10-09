// App.js

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import cities from './cities';
import { geneticAlgorithm } from './components/algorithm/geneticAlgorithm'; // Import nga komponenti i ri // Importo algoritmin
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

function App() {
  const [bestPath, setBestPath] = useState([]);

  useEffect(() => {
    const result = geneticAlgorithm(cities, 100, 1000); // 100 population, 1000 generations
    setBestPath(result); // Vendos rrugën menjëherë
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
