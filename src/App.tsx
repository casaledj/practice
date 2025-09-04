import React, { useState, useEffect } from 'react';
import RestaurantList from './components/RestaurantList';
import MapComponent from './components/MapComponent';
import { fetchRestaurants, getUserLocation } from './services/restaurantService';
import { Restaurant } from './types';

const App: React.FC = () => {
    const [location, setLocation] = useState('');
    const [radius, setRadius] = useState(5); // default radius in miles
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        getUserLocation().then(coords => {
            setUserLocation(coords);
            setLocation(`${coords.latitude},${coords.longitude}`);
            // Pass userLat and userLon directly
            fetchRestaurants(coords.latitude, coords.longitude, radius).then(data => {
                // Sort restaurants by distance
                const sortedData = [...data].sort((a, b) => {
                    const distA = a.distance !== undefined ? a.distance : Infinity;
                    const distB = b.distance !== undefined ? b.distance : Infinity;
                    return distA - distB;
                });
                setRestaurants(sortedData);
            });
        }).catch(error => {
            console.error("Error getting user location:", error);
            // Fallback or error handling if geolocation fails
        });
    }, []); // Empty dependency array means this runs once on mount

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
    };

    const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(event.target.value));
    };

    const handleSearch = () => {
        if (userLocation) { // Ensure userLocation is available
            // Pass userLat and userLon directly
            fetchRestaurants(userLocation.latitude, userLocation.longitude, radius).then(data => {
                // Sort restaurants by distance
                const sortedData = [...data].sort((a, b) => {
                    const distA = a.distance !== undefined ? a.distance : Infinity;
                    const distB = b.distance !== undefined ? b.distance : Infinity;
                    return distA - distB;
                });
                setRestaurants(sortedData);
            });
        } else if (location.includes(',')) { // Fallback if userLocation is not set but location string is valid
            const [lat, lon] = location.split(',').map(Number);
            fetchRestaurants(lat, lon, radius).then(data => {
                // Sort restaurants by distance
                const sortedData = [...data].sort((a, b) => {
                    const distA = a.distance !== undefined ? a.distance : Infinity;
                    const distB = b.distance !== undefined ? b.distance : Infinity;
                    return distA - distB;
                });
                setRestaurants(sortedData);
                setUserLocation({ latitude: lat, longitude: lon }); // Update userLocation
            });
        }
    };

    const handleUseMyLocation = () => {
        getUserLocation().then(coords => {
            setUserLocation(coords);
            setLocation(`${coords.latitude},${coords.longitude}`);
            // Pass userLat and userLon directly
            fetchRestaurants(coords.latitude, coords.longitude, radius).then(data => {
                // Sort restaurants by distance
                const sortedData = [...data].sort((a, b) => {
                    const distA = a.distance !== undefined ? a.distance : Infinity;
                    const distB = b.distance !== undefined ? b.distance : Infinity;
                    return distA - distB;
                });
                setRestaurants(sortedData);
            });
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1 }}>
                    <RestaurantList restaurants={restaurants} />
                </div>
                <div style={{ flex: 1 }}>
                    {userLocation && (
                        <MapComponent
                            restaurants={restaurants}
                            userLocation={userLocation}
                            radius={radius}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;