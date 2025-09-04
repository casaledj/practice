export interface Restaurant {
    id: string;
    name: string;
    address: string;
    cuisine?: string;
    distance?: number; // Distance from the user's location in miles
    latitude?: number;
    longitude?: number;
}

export interface Location {
    latitude: number;
    longitude: number;
}