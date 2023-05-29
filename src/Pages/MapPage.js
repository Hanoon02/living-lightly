import React, {useState} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../Config/env';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { COMPASS_ASSET, INSET_MAP_ZOOM, MAP_BOUNDS, MAP_CENTER, MAP_OVERLAY_ASSET, MAP_ZOOM, ZOOM_IN_LIMIT, ZOOM_OUT_LIMIT, ROUTE_ID, ROUTE_MARKER_IMG } from '../Constants/constants';
import { getContentForChannel } from '../Client/mvc.client';
import { Marker, Map, useMap, MapProvider, Popup } from 'react-map-gl';
import { ZoomStepper } from '../Components/Map/components.map';
mapboxgl.accessToken = env_vars.ACCESS_TOKEN

export default function MapPage() {
    const [showCommunity, setShowCommunity] = useState(false);
    const [showRoutes, setShowRoutes] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    const handleShowRoutes = () => {
        if(showRoutes){
            setMarkers([]);
        }
        else{
            getContentForChannel(ROUTE_ID).then(response => {
                setMarkers(response.data);
                console.log(response.data);
            })
        }
        setShowRoutes(!showRoutes);
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
                    // maxZoom={ZOOM_OUT_LIMIT}
                    // minZoom={ZOOM_IN_LIMIT}
                    id="primary_map"
                    maxBounds={MAP_BOUNDS}
                    style={{ zIndex: 0, opacity: 0.5 }}
                    mapStyle={env_vars.MAP_STYLE}
                    mapboxAccessToken={env_vars.ACCESS_TOKEN}
                >;
                    <Box sx={{ position: 'absolute', top: "50px", left: "80px", zIndex: 10 }}>
                        <MenuIcon/>
                    </Box>
                    <Box sx={{ backgroundImage: COMPASS_ASSET, zIndex: 11, backgroundSize: "cover", width: 100, height: 100, zIndex: 2, position: 'absolute', top: '50px', right: '50px' }} />
                    {showRoutes && markers && markers.length != 0 && markers.map(marker => {
                        return (
                            <div className={'flex'}>
                                <Marker
                                    longitude={marker.long}
                                    latitude={marker.lat}
                                    onClick={()=>{setShowPopup(true)}}>
                                    {marker.thumbnail && <img src={marker.thumbnail} />}
                                </Marker>
                                {showPopup && (
                                    <Popup longitude={marker.long} latitude={marker.lat}
                                           anchor="bottom"
                                    onClose={() => setShowPopup(false)}>
                                        RandomInfo
                                </Popup>)}
                                {/*<Box sx={{ position: 'relative', zIndex: 10 }}>*/}
                                {/*    {marker.title}*/}
                                {/*</Box>*/}
                            </div>);
                    })}
                    <Box sx={{ position: 'absolute', bottom: "50px", left: "50px", zIndex: 10 }}>
                        <ZoomStepper zoom={MAP_ZOOM} />
                    </Box>
                    <Box sx={{ position: 'absolute', bottom: "100px", left: "50px", zIndex: 10 }}>
                        <p onClick={()=>{handleShowRoutes()}} className={'text-[30px] text-[#356693] cursor-pointer'}> Van Gujjars of Uttarakhand </p>
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
                        />;
                    </Box>
                </Map>
            </Box>
        </MapProvider>


    );
}