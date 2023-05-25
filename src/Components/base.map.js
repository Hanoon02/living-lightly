import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../Config/env';
import { Box, Fa } from '@mui/material';


mapboxgl.accessToken = env_vars.ACCESS_TOKEN

export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const insetMapContainer = useRef(null);
    const insetMap = useRef(null);


    const initMap = () => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: env_vars.MAP_STYLE,
            center: [-70.9, 42.35],
            zoom: 13
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

    const initInsetMap = () => {
        const map = new mapboxgl.Map({
            container: insetMapContainer.current,
            style: env_vars.MAP_STYLE,
            center: [-70.9, 42.35],
            zoom: 13,
        });
        return map
    }


    useEffect(() => {
        if (map.current && insetMap.current) return;
        map.current = initMap()
        insetMap.current = initInsetMap()


    }, []);


    return (

        <Box sx={{ width: '100vw', height: '100vh', padding: 0, zIndex: 0 }} ref={mapContainer}>
            <Box sx={{ border: 1, borderStyle: 'dashed',borderRadius:1, borderColor:"brown", width: 100, height: 100, zIndex: 10, position: 'absolute', bottom: '50px', right: '50px' }} ref={insetMapContainer}></Box>
        </Box >
    );
}