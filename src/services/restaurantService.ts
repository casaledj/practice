import axios from 'axios';
import { Restaurant } from '../types';

const FOURSQUARE_API_URL = 'https://api.foursquare.com/v3/places/search';
const FOURSQUARE_API_KEY = process.env.REACT_APP_FOURSQUARE_API_KEY;

export const fetchRestaurants = async (location: string, radius: number): Promise<Restaurant[]> => {
    try {
        const radiusInMeters = radius * 1609.34; // Convert miles to meters
        const response = await axios.get(FOURSQUARE_API_URL, {
            params: {
                ll: location,
                radius: radiusInMeters,
                categories: '4d4b7105d754a06374d81259', // Category ID for restaurants
                limit: 50, // Limit the number of results
                v: '20250903' // Foursquare API versioning parameter (YYYYMMDD)
            },
            headers: {
                Accept: 'application/json',
                Authorization: FOURSQUARE_API_KEY,
            },
        });

        return response.data.results.map((place: any) => ({
            id: place.fsq_id,
            name: place.name,
            address: place.location.address,
            rating: 0, // Foursquare Places API search results do not directly provide a rating
            distance: place.distance / 1609.34, // Convert meters back to miles
        }));
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