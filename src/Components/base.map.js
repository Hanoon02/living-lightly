import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../Config/env';
import { Box } from '@mui/material';


mapboxgl.accessToken = env_vars.ACCESS_TOKEN

export default function App() {


    const mapContainer = useRef(null);
    const map = useRef(null);

    const initMap = () => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: env_vars.MAP_STYLE,
            center: [-70.9, 42.35],
            zoom: 13,
        });
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            })
        );
        return map
    }
    useEffect(() => {
        if (map.current) return;
        map.current = initMap()
        
         
    },[]);

    useEffect(() => {
        if (!map.current) return;
    });

    return (

        <Box sx={{ width: '100vw', height: '100vh', padding: 0 }} ref={mapContainer} />
    );
}