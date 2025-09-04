import axios from 'axios';
import { Restaurant } from '../types';
import { calculateDistance } from './locationUtils'; // Import the utility function

const GEOAPIFY_API_URL = 'https://api.geoapify.com/v2/places';
const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;

export const fetchRestaurants = async (
    userLat: number, // New parameter for user's latitude
    userLon: number, // New parameter for user's longitude
    radius: number
): Promise<Restaurant[]> => {
    try {
        const radiusInMeters = radius * 1609.34; // Convert miles to meters
        // Use userLat and userLon directly for the filter
        const response = await axios.get(GEOAPIFY_API_URL, {
            params: {
                categories: 'catering.restaurant',
                filter: `circle:${userLon},${userLat},${radiusInMeters}`,
                limit: 50,
                apiKey: GEOAPIFY_API_KEY,
            },
        });

        return response.data.features.map((feature: any) => {
            const restaurantLat = feature.properties.lat;
            const restaurantLon = feature.properties.lon;

            // Calculate distance manually using Haversine formula
            const distance = (restaurantLat && restaurantLon)
                ? calculateDistance(userLat, userLon, restaurantLat, restaurantLon)
                : undefined; // Set to undefined if coordinates are missing

            return {
                id: feature.properties.place_id,
                name: feature.properties.name,
                address: feature.properties.formatted,
                distance: distance,
                latitude: restaurantLat,
                longitude: restaurantLon,
            };
        });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
    }
};

export const getUserLocation = (): Promise<{latitude: number, longitude: number}> => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
};