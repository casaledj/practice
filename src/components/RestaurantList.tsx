import React from 'react';
import { ListGroup, Card } from 'react-bootstrap'; // Import Bootstrap components

import { Restaurant } from '../types';

interface RestaurantListProps {
    restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
    return (
        <div>
            <h2 className="text-center mb-4">Local Restaurants</h2>
            {restaurants.length === 0 ? (
                <p>No restaurants found. Try adjusting your search criteria.</p>
            ) : (
                <ListGroup>
                    {restaurants.map((restaurant) => (
                        <ListGroup.Item key={restaurant.id} className="mb-3 p-0 border-0">
                            <Card className="shadow-sm rounded">
                                <Card.Body>
                                    <Card.Title>{restaurant.name}</Card.Title>
                                    <Card.Text>
                                        {restaurant.address}<br />
                                        Distance: {restaurant.distance ? `${restaurant.distance.toFixed(2)}` : 'N/A'} miles
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default RestaurantList;