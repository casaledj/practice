export interface Restaurant {
    id: string;
    name: string;
    address: string;
    cuisine: string;
    rating: number;
    distance: number; // Distance from the user's location in meters
}

export interface Location {
    latitude: number;
    longitude: number;
}