import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import cities from './cities';
import { geneticAlgorithm } from './components/algorithm/geneticAlgorithm';
import { bruteForceAlgorithm } from './components/algorithm/bruteForceAlgorithm';
import { dynamicProgrammingAlgorithm } from './components/algorithm/dynamicProgrammingAlgorithm';
import { approximationAlgorithm } from './components/algorithm/approximationAlgorithm'; // Importo algoritmin e ri
import 'leaflet/dist/leaflet.css';

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
  const [algorithm, setAlgorithm] = useState('genetic');
  const [key, setKey] = useState(0);

  useEffect(() => {
    let result = [];
    switch (algorithm) {
      case 'bruteforce':
        result = bruteForceAlgorithm(cities);
        if (result.length === 0) {
          alert("BruteForce algorithm is too slow for more than 10 cities.");
          return; 
        }
        break;
      case 'dynamic': // Kontrollo këtë rast
        result = dynamicProgrammingAlgorithm(cities); 
        break;
      case 'approximation':
        result = approximationAlgorithm(cities); 
        break;
      default:
        result = geneticAlgorithm(cities, 100, 1000); 
    }

    if (result && result.length > 0) {
      setBestPath(result);
      setKey(prevKey => prevKey + 1);
    }
  }, [algorithm]);

  return (
    <div>
      <h1>Traveling Salesman Problem - Kosovo</h1>

      {/* Dropdown për zgjedhjen e algoritmit */}
      <select onChange={(e) => setAlgorithm(e.target.value)}>
        <option value="genetic">Genetic Algorithm</option>
        <option value="bruteforce">BruteForce Algorithm</option>
        <option value="dynamic">Dynamic Programming</option>
        <option value="approximation">Approximation Algorithm</option> {/* Shto algoritmin e ri */}
      </select>

      <MapContainer key={key} center={[42.6629, 21.1655]} zoom={8} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {cities.map((city, index) => (
          <Marker key={index} position={[city.lat, city.lon]} icon={customIcon} />
        ))}
        <Polyline positions={bestPath.map(city => [city.lat, city.lon])} />
      </MapContainer>
    </div>
  );
}

export default App;
