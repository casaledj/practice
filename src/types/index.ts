export interface Restaurant {
    id: string;
    name: string;
    address: string;
    categories?: string[];
    distance?: number; // Distance from the user's location in miles
    latitude?: number;
    longitude?: number;
    cleanedAddress?: string;
    phoneNumber?: string;
    website?: string;
}

export interface Location {
    latitude: number;
    longitude: number;
}