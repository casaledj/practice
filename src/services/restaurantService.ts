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

            const rawCategories: string[] = feature.properties.categories || [];
            const processedCategories = rawCategories
                .filter(cat => cat.startsWith('catering.restaurant.') && cat !== 'catering.restaurant')
                .map(cat => {
                    const parts = cat.replace('catering.restaurant.', '').split('.');
                    return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
                });

            // Attempt to remove the restaurant name from the formatted address for better deduplication
            const cleanedAddress = feature.properties.formatted.replace(new RegExp(`^${feature.properties.name},?\s*`, 'i'), '').trim();

            return {
                id: feature.properties.place_id,
                name: feature.properties.name,
                address: feature.properties.formatted,
                distance: distance,
                latitude: restaurantLat,
                longitude: restaurantLon,
                categories: processedCategories,
                cleanedAddress: cleanedAddress, // Add cleanedAddress to the Restaurant object
            };
        }).filter((restaurant: Restaurant, index: number, self: Restaurant[]) =>
            index === self.findIndex((r: Restaurant) => (
                r.name === restaurant.name &&
                r.cleanedAddress === restaurant.cleanedAddress
            ))
        );
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
    }
};