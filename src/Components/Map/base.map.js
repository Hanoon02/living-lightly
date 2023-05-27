import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../../Config/env';
import { Box } from '@mui/material';
import { INSET_MAP_ZOOM, MAP_BOUNDS, MAP_CENTER, MAP_ZOOM } from '../../Constants/constants';
import { getContentForChannel } from '../../Client/mvc.client';
import { Marker, Map } from 'react-map-gl';

mapboxgl.accessToken = env_vars.ACCESS_TOKEN

export default function BaseMap() {
    const [markers, setMarkers] = useState([]);
    useEffect(() => {
        getContentForChannel("9aitnqa").then(response => {
            setMarkers(response.data);
        })
    }, [])


    return (
        <Box sx={{ backgroundImage: "url(/Assets/Images/map_overlay.png)",  width: '100vw', height: '100vh', backgroundSize:"100vw 100vh", zIndex: 1 }}>
            <Map
                initialViewState={{
                    longitude: MAP_CENTER.long,
                    latitude: MAP_CENTER.lat,
                    zoom: MAP_ZOOM
                }}
                maxBounds={MAP_BOUNDS}
                style={{  zIndex: 0, opacity: 0.5 }}
                mapStyle={env_vars.MAP_STYLE}
                mapboxAccessToken={env_vars.ACCESS_TOKEN}
            >;
                <Box sx={{ backgroundImage: "url(/Assets/Images/compass_north.png)", zIndex: 11, backgroundSize:"cover", width: 100, height: 100, zIndex: 2, position: 'absolute', top: '50px', right: '50px' }} />

                {markers && markers.length != 0 && markers.map(marker => {
                    return (
                        <Marker
                            longitude={marker.long}
                            latitude={marker.lat}>

                            {marker.thumbnail && <img src={marker.thumbnail} />}
                        </Marker>);
                })}
                <Box sx={{ backgroundImage: "url(/Assets/Images/inset_map_overlay.png)", zIndex: 5, border: 1, borderStyle: 'dashed', borderRadius: 1, borderColor: "brown", width: 100, height: 100, zIndex: 2, position: 'absolute', bottom: '50px', right: '100px' }}>
                    <Map
                        initialViewState={{
                            longitude: MAP_CENTER.long,
                            latitude: MAP_CENTER.lat,
                            zoom: INSET_MAP_ZOOM
                        }}
                        style={{ width: '100%', height: '100%', zIndex: 2, opacity: 1 }}
                        mapStyle={env_vars.MAP_STYLE}
                        mapboxAccessToken={env_vars.ACCESS_TOKEN}
                    />;
                </Box>
            </Map>
        </Box>

    );
}