import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../Config/env';
import { Box } from '@mui/material';
import { MAP_CENTER, MAP_ZOOM } from '../Constants/constants';
import { getContentForChannel } from '../Client/mvc.client';

mapboxgl.accessToken = env_vars.ACCESS_TOKEN

export default function Map() {


    const mapContainer = useRef(null);
    const map = useRef(null);
    const insetMapContainer = useRef(null);
    const insetMap = useRef(null);


    const initMap = () => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: env_vars.MAP_STYLE,
            center: MAP_CENTER,
            zoom: MAP_ZOOM
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
        return new mapboxgl.Map({
            container: insetMapContainer.current,
            style: env_vars.MAP_STYLE,
            center: MAP_CENTER,
            zoom: MAP_ZOOM,
        });
    }


    useEffect(() => {
        if (map.current && insetMap.current) return;
        map.current = initMap()
        insetMap.current = initInsetMap()

        getContentForChannel("9aitnqa").then(res => {
            console.log(res)
        })
    }, []);


    return (
        <Box sx={{ backgroundImage: "url(/Assets/Images/map_overlay.png)", zIndex: 1 }}>
            <Box sx={{ width: '100vw', opacity: 0.5, height: '100vh', padding: 0, zIndex: 0 }} ref={mapContainer}>
                <Box sx={{ backgroundImage: "url(/Assets/Images/inset_map_overlay.png)", zIndex: 5 }}>
                    <Box sx={{ border: 1, borderStyle: 'dashed', borderRadius: 1, borderColor: "brown", width: 100, height: 100, zIndex: 2, position: 'absolute', bottom: '50px', right: '50px' }} ref={insetMapContainer}></Box>

                </Box>
            </Box >
        </Box>

    );
}