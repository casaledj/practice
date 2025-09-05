import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import MapComponent from './components/MapComponent';
import RestaurantList from './components/RestaurantList';
import SearchBar from './components/SearchBar';
import { Restaurant } from './types';
import { fetchRestaurants } from './services/restaurantService';
import { getCurrentLocation, geocodeLocation } from './services/locationUtils';

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [city, setCity] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(5);

  const handleFetchRestaurants = async (location: { latitude: number; longitude: number }) => {
    try {
      const fetchedRestaurantsData = await fetchRestaurants(location.latitude, location.longitude, radius);
      fetchedRestaurantsData.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setRestaurants(fetchedRestaurantsData);
    } catch (err) {
      setError('Error fetching restaurants.');
      console.error(err);
    }
  };

  const handleCitySearch = async (cityName: string) => {
    try {
      const location = await geocodeLocation(cityName);
      if (location) {
        setCity(location);
        setUserLocation(null); 
        handleFetchRestaurants(location);
      } else {
        setError('City not found. Please try another city.');
      }
    } catch (err) {
      setError('Error geocoding city.');
      console.error(err);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
        setCity(null); 
        handleFetchRestaurants(location);
      }
    } catch (err) {
      setError('Error fetching current location.');
      console.error(err);
    }
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, [radius]);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(Number(e.target.value));
  };

  return (
    <Container className="mt-4 py-4">
      <h1 className="text-center mb-4">Local Restaurants</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <SearchBar onSearch={handleCitySearch} onUseCurrentLocation={handleUseCurrentLocation} />

      <Form className="mb-3">
        <Form.Group as={Row} controlId="formRadius">
          <Form.Label column sm={2}>
            Search Radius (miles):
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="range"
              value={radius}
              onChange={handleRadiusChange}
              min="1"
              max="30"
              step="1"
              className="form-range"
            />
            <span>{radius} miles</span>
          </Col>
        </Form.Group>
      </Form>

      <Row className="mt-4">
        <Col md={8}>
          <MapComponent restaurants={restaurants} userLocation={userLocation} radius={radius} city={city} />
        </Col>
        <Col md={4} className="p-3">
          <div style={{ height: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            <RestaurantList restaurants={restaurants} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
