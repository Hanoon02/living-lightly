import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../../Config/env';
import { Box } from '@mui/material';
import { COMPASS_ASSET, INSET_MAP_ZOOM, MAP_BOUNDS, MAP_CENTER, MAP_OVERLAY_ASSET, MAP_ZOOM, ZOOM_IN_LIMIT, ZOOM_OUT_LIMIT, ROUTE_ID, ROUTE_MARKER_IMG } from '../../Constants/constants';
import { getContentForChannel } from '../../Client/mvc.client';
import { Marker, Map, MapProvider, Source, Layer } from 'react-map-gl';
import { MapPopup, ZoomStepper } from './components.map';
import { createLayer, createLineGeoJson, createPolygonLayer, createStatePolygon } from './utils.map';

mapboxgl.accessToken = env_vars.ACCESS_TOKEN


export default function BaseMap() {
    const [markers, setMarkers] = useState([]);
    const [showMarkers, setShowMarkers] = useState(false);
    const [showPopup, setShowPopup] = useState(null);
    const [scopedMarker, setScopedMarker] = useState({});
    const mapRef = useRef(null);
    const [state, setState] = useState("")
    const [geojson, setGeoJson] = useState(null);
    useEffect(() => {
        getContentForChannel(env_vars.ROUTE_ID).then(response => {
            setMarkers(response.data);
        })
    }, [])

    useEffect(() => {
        if (markers && markers.length > 0) {
            setGeoJson(createLineGeoJson(markers))
        }
    }, [markers])


    useEffect(() => {
        console.log(geojson)
    }, [geojson])


    const panTo = (coords, zoom) => {
        if (mapRef.current) {
            mapRef.current.flyTo(
                {
                    center: coords, zoom: zoom,
                    speed: 0.8,
                    curve: 1,
                    easing(t) {
                        return t;
                    }
                },
            )
        }
    }






    return (

        <MapProvider>
            <Box sx={{ backgroundImage: MAP_OVERLAY_ASSET, width: '100vw', height: '100vh', backgroundSize: "100vw 100vh", zIndex: 1 }}>
                <Map
                    initialViewState={{
                        longitude: MAP_CENTER.long,
                        latitude: MAP_CENTER.lat,
                        zoom: MAP_ZOOM

                    }}
                    maxZoom={ZOOM_IN_LIMIT}
                    minZoom={ZOOM_OUT_LIMIT}
                    id="primary_map"
                    maxBounds={MAP_BOUNDS}
                    ref={mapRef}
                    style={{ zIndex: 0, opacity: 0.5 }}
                    mapStyle={env_vars.MAP_STYLE}
                    mapboxAccessToken={env_vars.ACCESS_TOKEN}
                >;
                    <Source id="routes" type="geojson" data={geojson}>
                        {showMarkers && <Layer {...createLayer()}></Layer>}
                        <Box sx={{ backgroundImage: COMPASS_ASSET, zIndex: 11, backgroundSize: "cover", width: 100, height: 100, zIndex: 2, position: 'absolute', top: '50px', right: '50px' }} />
                        {showMarkers && markers && markers.length != 0 && markers.map(marker => {
                            return (
                                <div>
                                    <Marker
                                        longitude={marker.long}
                                        latitude={marker.lat}
                                        onClick={() => {
                                            panTo([marker.long, marker.lat],10)
                                            setScopedMarker(marker)
                                            setShowPopup(true)
                                        }
                                        }
                                    >
                                        {(scopedMarker.lat == marker.lat && scopedMarker.long == marker.long) ? <img src={ROUTE_MARKER_IMG} style={{ height: "40px" }}></img> : <img src={ROUTE_MARKER_IMG} style={{ height: "32px" }}></img>}

                                    </Marker>
                                </div>);
                        })}

                        {showPopup && <MapPopup marker={scopedMarker} onClose={() => { setShowPopup(false) }} />}


                        <Box sx={{ position: 'absolute', bottom: "50px", left: "50px", zIndex: 10 }}>
                            <ZoomStepper zoom={MAP_ZOOM} />
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: "100px", left: "50px", zIndex: 10 }}>
                            <p variant="h3" onClick={() => {
                                if (markers && markers.length != 0) {
                                    setState('Uttaranchal')
                                    panTo([markers[0].long, markers[0].lat], 8)
                                    setShowMarkers(true)
                                }

                            }} className={'text-[30px] text-[#000] cursor-pointer briem-font'}> Van Gujjars of Uttarakhand </p>
                        </Box>
                        <Box sx={{ backgroundImage: MAP_OVERLAY_ASSET, zIndex: 5, border: 1, borderStyle: 'dashed', borderRadius: 1, borderColor: "brown", width: 100, height: 100, zIndex: 2, position: 'absolute', bottom: '50px', right: '100px' }}>
                            <Map
                                initialViewState={{
                                    longitude: MAP_CENTER.long,
                                    latitude: MAP_CENTER.lat,
                                    zoom: INSET_MAP_ZOOM
                                }}
                                id="inset_map"
                                style={{ width: '100%', height: '100%', zIndex: 2, opacity: 1 }}
                                mapStyle={env_vars.MAP_STYLE}
                                mapboxAccessToken={env_vars.ACCESS_TOKEN}
                            >;
                                <Source id="Goa" type="geojson" data={createStatePolygon(state)} > 
                                    <Layer {...createPolygonLayer(state)}/>
                                </Source>
                            </Map>
                        </Box>
                    </Source>


                </Map>
            </Box>
        </MapProvider>


    );
}