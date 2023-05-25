import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const PharmacyMap = ({ mapCenter, pharmacies }) => {
    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_MAPS_API_KEY} libraries={['places']}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={mapCenter}
                zoom={10}
            >
                {pharmacies.map((pharmacy) => (
                    <Marker
                        key={pharmacy.id}
                        position={{ lat: pharmacy.lat, lng: pharmacy.lng }}
                    />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default PharmacyMap;
