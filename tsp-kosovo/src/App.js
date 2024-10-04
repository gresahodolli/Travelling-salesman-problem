import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for the custom icon
import cities from './cities';
import 'leaflet/dist/leaflet.css';

// Define the custom icon here
const customIcon = L.icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', // URL to a different icon
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png', // URL to the shadow image
  shadowSize: [41, 41] // size of the shadow
});

function App() {
  return (
    <div>
      <h1>Traveling Salesman Problem - Kosovo</h1>
      <MapContainer center={[42.6629, 21.1655]} zoom={8} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Map through cities and use customIcon for each Marker */}
        {cities.map((city, index) => (
          <Marker 
            key={index} 
            position={[city.lat, city.lon]} 
            icon={customIcon} 
          />
        ))}
        {/* Draw a line connecting all the cities */}
        <Polyline positions={cities.map(city => [city.lat, city.lon])} />
      </MapContainer>
    </div>
  );
}

export default App;
