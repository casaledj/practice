import React from 'react';

import { Restaurant } from '../types';

interface RestaurantListProps {
    restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
    return (
        <div>
            <h2>Local Restaurants</h2>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id}>
                        <h3>{restaurant.name}</h3>
                        <p>{restaurant.address}</p>
                        <p>Rating: {restaurant.rating}</p>
                        <p>Distance: {restaurant.distance} miles</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RestaurantList;