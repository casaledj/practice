export interface Restaurant {
    id: string;
    name: string;
    address: string;
    categories?: string[];
    distance?: number; // Distance from the user's location in miles
    latitude?: number;
    longitude?: number;
    cleanedAddress?: string;
}

export interface Location {
    latitude: number;
    longitude: number;
}