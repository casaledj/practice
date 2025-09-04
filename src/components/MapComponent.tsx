import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Restaurant } from '../types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Define a custom red icon for the user's location
const redIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="red" stroke="white" stroke-width="2"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

interface MapComponentProps {
  restaurants: Restaurant[];
  userLocation: { latitude: number; longitude: number } | null;
  radius: number;
  city: { latitude: number; longitude: number } | null;
}

const MapController: React.FC<{ userLocation: { latitude: number; longitude: number } | null; city: { latitude: number; longitude: number } | null; }> = ({ userLocation, city }) => {
  const map = useMap();

  useEffect(() => {
    if (city) {
      map.setView([city.latitude, city.longitude], map.getZoom());
    } else if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], map.getZoom());
    }
  }, [userLocation, city, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ restaurants, userLocation, radius, city }) => {
  const defaultCenter: [number, number] = [40.7128, -74.0060]; // Default to New York City
  const center: [number, number] = city ? [city.latitude, city.longitude] : userLocation ? [userLocation.latitude, userLocation.longitude] : defaultCenter;
  const radiusInMeters = radius * 1609.34; // Convert miles to meters

  return (
    <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapController userLocation={userLocation} city={city} />

      {userLocation && (
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={redIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {city && (
        <Marker position={[city.latitude, city.longitude]} icon={redIcon}>
          <Popup>Searched City</Popup>
        </Marker>
      )}

      {restaurants.map((restaurant) => (
        <Marker key={restaurant.id} position={[restaurant.latitude || 0, restaurant.longitude || 0]}>
          <Popup>
            <b>{restaurant.name}</b><br />
            {restaurant.address}<br />
            Distance: {restaurant.distance?.toFixed(2)} miles
          </Popup>
        </Marker>
      ))}

      {(userLocation || city) && radius > 0 && (
        <Circle center={center} radius={radiusInMeters} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
