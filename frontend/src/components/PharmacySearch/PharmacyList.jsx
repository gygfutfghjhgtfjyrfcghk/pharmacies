import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const PharmacyList = ({ pharmacies, onPharmacyClick, selectedPharmacies }) => {
    const [openPharmacy, setOpenPharmacy] = useState(null);

    const togglePharmacyDetails = (id, event) => {
        event.stopPropagation();
        if (openPharmacy === id) {
            setOpenPharmacy(null);
        } else {
            setOpenPharmacy(id);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        return (
            <>
                {[...Array(fullStars)].map((_, i) => (
                    <FontAwesomeIcon key={`full_${i}`} icon={faStar} color="rgb(255, 116, 37)" />
                ))}
                {[...Array(halfStars)].map((_, i) => (
                    <FontAwesomeIcon key={`half_${i}`} icon={faStarHalfAlt} color="rgb(255, 116, 37)" />
                ))}
                {[...Array(emptyStars)].map((_, i) => (
                    <FontAwesomeIcon key={`empty_${i}`} icon={faStar} style={{ opacity: 0.2 }} color="rgb(255, 116, 37)" />
                ))}
            </>
        );
    };


    return (
        <Row>
            {pharmacies.map((pharmacy) => (
                <Col md={6} key={pharmacy.id}>
                     <Card
                        style={{
                            marginBottom: '1rem',
                            backgroundColor: selectedPharmacies.some(
                                (selectedPharmacy) =>
                                    selectedPharmacy.id === pharmacy.id,
                            )
                                ? 'rgba(0, 123, 255, 0.1)' // Change to your desired background color for selected cards
                                : 'white',
                        }}
                       
                        onClick={() => onPharmacyClick(pharmacy)}
                    >
                        <Card.Body>
                            <Card.Title>{pharmacy.name}</Card.Title>
                            {openPharmacy !== pharmacy.id &&
                                <Button
                                    variant="primary"
                                    onClick={(event) => togglePharmacyDetails(pharmacy.id, event)}
                                    style={{
                                        position: 'absolute',
                                        bottom: '0.5rem',
                                    }}
                                >
                                    Show Details
                                </Button>
                            }
                            {openPharmacy === pharmacy.id && (
                                <>
                                    <Card.Text>{pharmacy.address}</Card.Text>
                                    <Card.Text>
                                        {pharmacy.phone
                                            ? 'Phone Number: ' + pharmacy.phone
                                            : ''}
                                    </Card.Text>
                                    <Card.Text>
                                        {pharmacy.internationalPhoneNumber
                                            ? 'International Number: ' +
                                            pharmacy.internationalPhoneNumber
                                            : ''}
                                    </Card.Text>
                                    {pharmacy.photo && (
                                        <Card.Img
                                            src={pharmacy.photo}
                                            style={{
                                                width: '100%',
                                                height: '200px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                    {pharmacy.rating && (
                                        <Card.Text>
                                            Rating: {renderStars(pharmacy.rating)}
                                        </Card.Text>
                                    )}
                                    {pharmacy.openingHours.length > 0 && (
                                        <Card.Text>
                                            Opening Hours:
                                            <ul>
                                                {pharmacy.openingHours.map(
                                                    (hour, index) => (
                                                        <li key={index}>{hour}</li>
                                                    ),
                                                )}
                                            </ul>
                                        </Card.Text>
                                    )}
                                </>
                            )}

                            {openPharmacy === pharmacy.id &&
                                <Button
                                    variant="primary"
                                    onClick={(event) => togglePharmacyDetails(pharmacy.id, event)}
                                    style={{
                                        position: 'absolute',
                                        bottom: '0.5rem',
                                    }}
                                >
                                    Hide Details
                                </Button>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default PharmacyList;
