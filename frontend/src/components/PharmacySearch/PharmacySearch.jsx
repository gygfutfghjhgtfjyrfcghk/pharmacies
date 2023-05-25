import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PharmacySearchForm from './PharmacySearchForm';
import PharmacyList from './PharmacyList';
import PharmacyMap from './PharmacyMap';



const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const checkDutyHours = (periods, duty) => {
    for (const period of periods) {
        if(!period.open || !period.close)
            continue;
        const openTime = period.open.hours * 60 + period.open.minutes;
        const closeTime = period.close.hours * 60 + period.close.minutes;

        const isDaytime = openTime >= 6 * 60 && closeTime < 18 * 60;
        const isNighttime = (openTime >= 18 * 60 || openTime < 6 * 60) && (closeTime >= 18 * 60 || closeTime < 6 * 60);

        if (duty === 'day' && isDaytime) {
            return true;
        } else if (duty === 'night' && isNighttime) {
            return true;
        }
    }

    return false;
};

const fetchCountryCode = async () => {
    try {
        const response = await fetch('https://ipwhois.app/json/');
        const data = await response.json();
        return data.country_code;
    } catch (error) {
        console.error('Error fetching country code', error);
        return null;
    }
};

const PharmacySearch = () => {
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedDuty, setSelectedDuty] = useState('');
    const [pharmacies, setPharmacies] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedPharmacies, setSelectedPharmacies] = useState([]);
    const [userCountryCode, setUserCountryCode]= useState("US");
    const [searching, setSearching]= useState(false);

    useEffect(() => {
        const fetchUserCountryCodeAndCities = async () => {
            const countryCode = await fetchCountryCode();
            if (countryCode) {
                fetchCities(countryCode);
                setUserCountryCode(countryCode);
            }
        };

        fetchUserCountryCodeAndCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetchZones(selectedCity);
        }
    }, [selectedCity]);

    const fetchCities = async (countryCode) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/cities/${countryCode}`);
            const cities = await response.json();
            setCities(cities.map((city, index) => ({ id: index + 1, name: city })));
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchZones = async (city) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/areas/${city.name}/${userCountryCode}`);
            const areas = await response.json();
            setZones(areas.map((area, index) => ({ id: index + 1, name: area })));
        } catch (error) {
            console.error('Error fetching zones:', error);
        }
    };

    const handleCityChange = async (event) => {
        const cityId = event.target.value;
        const city = cities.find((city) => city.id === parseInt(cityId));
        setSelectedCity(city);

        const cityZones = await fetchZones(city);
        setZones(cityZones);
    };

    const handleZoneChange = (event) => {
        const zoneId = event.target.value;
        const zone = zones.find((zone) => zone.id === parseInt(zoneId));
        setSelectedZone(zone);
    };

    const handleDutyChange = (event) => {
        setSelectedDuty(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const pharmaciesResult = await fetchPharmacies(selectedCity, selectedZone, selectedDuty);
            setPharmacies(pharmaciesResult);
            if (pharmaciesResult.length > 0) {
                setMapCenter({ lat: pharmaciesResult[0].lat, lng: pharmaciesResult[0].lng });
                setMapVisible(true);
            }

        } catch (error) {
            console.error('Error fetching pharmacies:', error);
        }
    };

    const fetchPharmacies = async (city, zone, duty) => {
        setSearching(true)
        if (!city || !zone) {
            throw new Error('City or Zone is not selected');
        }

        const location = `${city.name}, ${zone.name}`;
        const coordinates = await getCoordinatesForLocation(location);

        return new Promise((resolve, reject) => {
            const map = new window.google.maps.Map(document.createElement('div'));
            const request = {
                location: new window.google.maps.LatLng(coordinates.lat, coordinates.lng),
                radius: '5000',
                type: ['pharmacy'],
                keyword: duty === 'day' ? 'daytime' : 'nighttime',
            };

            const service = new window.google.maps.places.PlacesService(map);
            service.nearbySearch(request, async (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    try {
                        const pharmacies = [];

                        for (const result of results) {
                            const detailsRequest = { placeId: result.place_id };
                            const details = await new Promise((resolveDetails, rejectDetails) => {
                                service.getDetails(detailsRequest, (detailsResult, detailsStatus) => {
                                    if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                                        resolveDetails(detailsResult);
                                    } else {
                                        rejectDetails(detailsStatus);
                                    }
                                });
                            });

                            console.log(details.opening_hours, duty)

                            if (details.opening_hours && checkDutyHours(details.opening_hours.periods, duty)) {
                                pharmacies.push({
                                    id: details.place_id,
                                    name: details.name,
                                    address: details.formatted_address,
                                    phone: details.formatted_phone_number,
                                    lat: details.geometry.location.lat(),
                                    lng: details.geometry.location.lng(),
                                    openingHours: details.opening_hours ? details.opening_hours.weekday_text : [],
                                    internationalPhoneNumber: details.international_phone_number || '',
                                    rating: details.rating || '',
                                    photo: details.photos && details.photos.length > 0 ? details.photos[0].getUrl() : '',
                                });
                            }

                            await wait(200); // Introduce a delay between requests (in milliseconds)
                        }
                        setSearching(false);
                        resolve(pharmacies);
                    } catch (error) {
                        setSearching(false)
                        reject(error);
                    }
                } else {
                    setSearching(false)
                    reject(status);
                }
            });

        });
    };

    const getCoordinatesForLocation = async (location) => {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.REACT_APP_MAPS_API_KEY}`
        );

        const data = await response.json();
        if (data.status === 'OK' && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        } else {
            throw new Error('Unable to fetch coordinates for the given location');
        }
    };


    const togglePharmacySelection = (pharmacy) => {
        if (selectedPharmacies.some((selected) => selected.id === pharmacy.id)) {
            setSelectedPharmacies((prevState) =>
                prevState.filter((selected) => selected.id !== pharmacy.id)
            );

        } else {
            setMapCenter({ lat: pharmacy.lat, lng: pharmacy.lng })
            setSelectedPharmacies((prevState) => [...prevState, pharmacy]);
        }
    };


    return (
        <Container>
            <Row>
                <Col md={mapVisible ? 6 : 12}>
                    <h3>Search Pharmacies on Duty</h3>
                    <PharmacySearchForm
                        cities={cities}
                        zones={zones}
                        selectedCity={selectedCity}
                        selectedZone={selectedZone}
                        selectedDuty={selectedDuty}
                        handleCityChange={handleCityChange}
                        handleZoneChange={handleZoneChange}
                        handleDutyChange={handleDutyChange}
                        handleSubmit={handleSubmit}
                        searching={searching}
                    />
                    <PharmacyList
                        pharmacies={pharmacies}
                        onPharmacyClick={togglePharmacySelection}
                        selectedPharmacies={selectedPharmacies}
                    />
                </Col>

                <Col md={6} style={{ display: mapVisible ? "block" : "none" }}>
                    <PharmacyMap mapCenter={mapCenter} pharmacies={selectedPharmacies} />
                </Col>

            </Row>
        </Container>
    );

}
export default PharmacySearch