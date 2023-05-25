import React from 'react';
import { Form, Button } from 'react-bootstrap';

const PharmacySearchForm = ({ 
    cities, 
    zones, 
    selectedCity, 
    selectedZone, 
    selectedDuty, 
    handleCityChange, 
    handleZoneChange, 
    handleDutyChange, 
    handleSubmit,
    searching
}) => {
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control as="select" value={selectedCity?.id} onChange={handleCityChange}>
                    <option value="">Select City</option>
                    {cities && cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="zone">
                <Form.Label>Zone</Form.Label>
                <Form.Control as="select" value={selectedZone?.id} onChange={handleZoneChange}>
                    <option value="">Select Zone</option>
                    {zones && zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                            {zone.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="duty">
                <Form.Label>Duty Type</Form.Label>
                <Form.Control as="select" value={selectedDuty} onChange={handleDutyChange}>
                    <option value="">Select Duty Type</option>
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                </Form.Control>
            </Form.Group>
            <Button type="submit" className="mt-3 mb-3" disabled={searching}>
                {searching ? "Searching..." : "Search"}
                
            </Button>
        </Form>
    );
};

export default PharmacySearchForm;
