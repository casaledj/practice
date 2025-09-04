import React, { useState, useEffect } from 'react';
import RestaurantList from './components/RestaurantList';
import { fetchRestaurants, getUserLocation } from './services/restaurantService';
import { Restaurant } from './types';

const App: React.FC = () => {
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(5); // default radius in miles
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
    };

    const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(event.target.value));
    };

    const handleSearch = () => {
        fetchRestaurants(location, radius).then(data => {
            setRestaurants(data);
        });
    };

    const handleUseMyLocation = () => {
        getUserLocation().then(coords => {
            setLocation(`${coords.latitude},${coords.longitude}`);
        });
    };
        

    return (
        <div>
            <h1>Local Restaurants</h1>
            <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={handleLocationChange}
            />
            <input
                type="range"
                min="1"
                max="30"
                value={radius}
                onChange={handleRadiusChange}
            />
            <span>{radius} miles</span>
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleUseMyLocation}>Use My Location</button>
            <RestaurantList restaurants={restaurants} />
        </div>
    );
};

export default App;