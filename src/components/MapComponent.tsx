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
}

const MapController: React.FC<{ userLocation: { latitude: number; longitude: number } | null } > = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.latitude, userLocation.longitude], map.getZoom());
    }
  }, [userLocation, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ restaurants, userLocation, radius }) => {
  if (!userLocation) {
    return <div>Loading map...</div>;
  }

  const center: [number, number] = [userLocation.latitude, userLocation.longitude];
  const radiusInMeters = radius * 1609.34; // Convert miles to meters

  return (
    <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapController userLocation={userLocation} />

      {userLocation && (
        <Marker position={center} icon={redIcon}>
          <Popup>Your Location</Popup>
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

      {userLocation && radius > 0 && (
        <Circle center={center} radius={radiusInMeters} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
      )}
    </MapContainer>
  );
};

export default MapComponent;
