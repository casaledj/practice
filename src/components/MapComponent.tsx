import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { divIcon } from 'leaflet';
import { Restaurant } from '../types';

// Function to create a custom divIcon with an emoji
const getCategoryIcon = (categories: string[] | undefined) => {
  let emoji = '🍽️'; // Default emoji

  if (categories) {
    const lowerCaseCategories = categories.map(cat => cat.toLowerCase());

    if (lowerCaseCategories.some(cat => cat.includes('pizza'))) {
      emoji = '🍕';
    } else if (lowerCaseCategories.some(cat => cat.includes('sushi'))) {
      emoji = '🍣';
    } else if (lowerCaseCategories.some(cat => cat.includes('steak_house'))) {
      emoji = '🥩';
    } else if (lowerCaseCategories.some(cat => cat.includes('burger'))) {
      emoji = '🍔';
    } else if (lowerCaseCategories.some(cat => cat.includes('sandwich'))) {
      emoji = '🥪';
    } else if (lowerCaseCategories.some(cat => cat.includes('wings'))) {
      emoji = '🍗';
    } else if (lowerCaseCategories.some(cat => cat.includes('mexican') || cat.includes('tex-mex'))) {
      emoji = '🌮';
    } else if (lowerCaseCategories.some(cat => cat.includes('indian'))) {
      emoji = '🍛';
    } else if (lowerCaseCategories.some(cat => cat.includes('chinese'))) {
      emoji = '🍜';
    } else if (lowerCaseCategories.some(cat => cat.includes('japanese'))) {
      emoji = '🇯🇵';
    } else if (lowerCaseCategories.some(cat => cat.includes('korean'))) {
      emoji = '🇰🇷';
    } else if (lowerCaseCategories.some(cat => cat.includes('italian'))) {
      emoji = '🍝';
    } else if (lowerCaseCategories.some(cat => cat.includes('mediterranean'))) {
      emoji = '🥙';
    } else if (lowerCaseCategories.some(cat => cat.includes('cuban'))) {
      emoji = '🇨🇺';
    } else if (lowerCaseCategories.some(cat => cat.includes('turkish'))) {
      emoji = '🇹🇷';
    } else if (lowerCaseCategories.some(cat => cat.includes('arab'))) {
      emoji = '🇦🇪';
    } else if (lowerCaseCategories.some(cat => cat.includes('american'))) {
      emoji = '🍔'; // Using burger for general American
    } else if (lowerCaseCategories.some(cat => cat.includes('asian'))) {
      emoji = '🍜'; // Using noodle for general Asian
    } else if (lowerCaseCategories.some(cat => cat.includes('coffee') || cat.includes('cafe'))) {
      emoji = '☕';
    } else if (lowerCaseCategories.some(cat => cat.includes('bar') || cat.includes('pub'))) {
      emoji = '🍻';
    } else if (lowerCaseCategories.some(cat => cat.includes('vegan') || cat.includes('vegetarian'))) {
      emoji = '🥗';
    } else if (lowerCaseCategories.some(cat => cat.includes('dessert') || cat.includes('ice_cream'))) {
      emoji = '🍰';
    } else if (lowerCaseCategories.some(cat => cat.includes('breakfast') || cat.includes('brunch'))) {
      emoji = '🍳';
    } else if (lowerCaseCategories.some(cat => cat.includes('seafood'))) {
      emoji = '🦞';
    } else if (lowerCaseCategories.some(cat => cat.includes('thai'))) {
      emoji = '🌶️';
    } else if (lowerCaseCategories.some(cat => cat.includes('bakery'))) {
      emoji = '🍞';
    } else if (lowerCaseCategories.some(cat => cat.includes('fast_food'))) {
      emoji = '🍟';
    } else if (lowerCaseCategories.some(cat => cat.includes('restaurant'))) {
      emoji = '🍽️'; // General restaurant
    } else if (lowerCaseCategories.some(cat => cat.includes('supermarket') || cat.includes('grocery'))) {
      emoji = '🛒';
    } else if (lowerCaseCategories.some(cat => cat.includes('park'))) {
      emoji = '🌳';
    }
  }

  return divIcon({
    html: `<div style="font-size: 24px;">${emoji}</div>`,
    className: 'custom-map-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -12],
  });
};

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
        <Marker key={restaurant.id} position={[restaurant.latitude || 0, restaurant.longitude || 0]} icon={getCategoryIcon(restaurant.categories)}>
          <Popup>
            <b>{restaurant.name}</b><br />
            {restaurant.address}<br />
            {restaurant.categories && restaurant.categories.length > 0 && (
              <>
                Categories: {restaurant.categories.join(', ')}<br />
              </>
            )}
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
