import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../Config/env';
import { Box } from '@mui/material';


mapboxgl.accessToken = env_vars.ACCESS_TOKEN

export default function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: env_vars.MAP_STYLE,
            center: [78.476681027237, 22.1991660760527],
            zoom: 5
        });
    });

    useEffect(() => {
        if (!map.current) return;
    });

    return (

        <Box sx={{ width: '100vw', height: '100vh', padding:0 }} ref={mapContainer}  />
    );
}