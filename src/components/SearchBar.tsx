
import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onUseCurrentLocation: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onUseCurrentLocation }) => {
  const [city, setCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <Form onSubmit={handleSearch} className="mb-4 p-4 rounded shadow-sm">
      <Row className="align-items-center">
        <Col xs={12} md={8}>
          <Form.Control
            type="text"
            placeholder="Enter a city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Col>
        <Col xs={12} md={2}>
          <Button variant="dark" type="submit" className="w-100">
            Search
          </Button>
        </Col>
        <Col xs={12} md={2}>
          <Button variant="outline-dark" onClick={onUseCurrentLocation} className="w-100">
            Use Current Location
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
