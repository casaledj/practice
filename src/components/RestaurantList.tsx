import React, { useState, useEffect } from 'react';
import { ListGroup, Card, Spinner } from 'react-bootstrap'; // Import Bootstrap components

import { Restaurant } from '../types';
import { fetchRestaurantDetails } from '../services/restaurantService';

interface RestaurantListProps {
    restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
    const [detailedRestaurantInfo, setDetailedRestaurantInfo] = useState<{ phoneNumber?: string; website?: string } | null>(null);
    const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

    useEffect(() => {
        const getDetails = async () => {
            if (selectedRestaurantId) {
                setLoadingDetails(true);
                try {
                    const details = await fetchRestaurantDetails(selectedRestaurantId);
                    setDetailedRestaurantInfo(details);
                } catch (error) {
                    console.error("Error fetching details:", error);
                    setDetailedRestaurantInfo(null);
                } finally {
                    setLoadingDetails(false);
                }
            }
        };
        getDetails();
    }, [selectedRestaurantId]);

    return (
        <div>
            <h2 className="text-center mb-4">Local Restaurants</h2>
            <p className="text-center text-muted mb-4">Click a restaurant for more information.</p>
            {restaurants.length === 0 ? (
                <p>No restaurants found. Try adjusting your search criteria.</p>
            ) : (
                <ListGroup>
                    {restaurants.map((restaurant) => (
                        <ListGroup.Item
                            key={restaurant.id}
                            className="mb-3 p-0 border-0"
                            action
                            onClick={() => setSelectedRestaurantId(restaurant.id)}
                            active={restaurant.id === selectedRestaurantId}
                        >
                            <Card className="shadow-sm rounded">
                                <Card.Body>
                                    <Card.Title>{restaurant.name}</Card.Title>
                                    <div>
                                        {restaurant.address}<br />
                                        Distance: {restaurant.distance ? `${restaurant.distance.toFixed(2)}` : 'N/A'} miles
                                        {restaurant.categories && restaurant.categories.length > 0 && (
                                            <><br />Categories: {restaurant.categories.join(', ')}</>
                                        )}
                                        {selectedRestaurantId === restaurant.id && loadingDetails && (
                                            <><br /><Spinner animation="border" size="sm" /> Loading details...</>
                                        )}
                                        {selectedRestaurantId === restaurant.id && detailedRestaurantInfo && (
                                            <>
                                                {detailedRestaurantInfo.phoneNumber && (
                                                    <><br />Phone: <a href={`tel:${detailedRestaurantInfo.phoneNumber}`}>{detailedRestaurantInfo.phoneNumber}</a></>
                                                )}
                                                {detailedRestaurantInfo.website && (
                                                    <><br />Website: <a href={detailedRestaurantInfo.website} target="_blank" rel="noopener noreferrer">{detailedRestaurantInfo.website}</a></>
                                                )}
                                            </>
                                        )}
                                    </div>
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