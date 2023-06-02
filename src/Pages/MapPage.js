import React, {useState, useEffect} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../Config/env';
import { Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { COMPASS_ASSET, INSET_MAP_ZOOM, MAP_BOUNDS, MAP_CENTER, MAP_OVERLAY_ASSET, MAP_ZOOM, ZOOM_IN_LIMIT, ZOOM_OUT_LIMIT, CHANNEL_ID, ROUTE_MARKER_IMG, ROUTE_IMG } from '../Constants/constants';
import { getSubChannel, getChannel, getContentForChannel } from '../Client/mvc.client';
import { Marker, Map, useMap, MapProvider, Popup } from 'react-map-gl';
import { ZoomStepper } from '../Components/Map/components.map';
import Menu from '../Components/Menu/menu';

export default function MapPage() {
    const [showCommunity, setShowCommunity] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showRoutes, setShowRoutes] = useState(false);
    const [showRouteMarkers, setShowRouteMarkers] = useState(false);
    const [allCommunity, setAllCommunity] = useState([]);
    const [allRoutes, setAllRoutes] = useState([]);
    const [routeStartMarkers, setRouteStartMarkers] = useState([]);
    const [routeMarkers, setRouteMarkers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        getAllCommunities();
    }, [])

    const getAllCommunities = () => {
        var communities = [];
        getSubChannel(CHANNEL_ID).then(response => {
            var data = response.data;
            data.forEach(element => {
                // console.log(element);
                communities.push(element);
            });
            setAllCommunity(communities);
        })
        // console.log("All Communities", communities);
    }

    const getAllRoutes = (communityID) => {
        var routes = [];
        getSubChannel(communityID).then(response => {
            var data = response.data;
            data.forEach(element => {
                // console.log(element);
                routes.push(element);
            });
            setAllRoutes(routes);
        })
        // console.log("All Routes", routes);
    }

    const showStartMarkers = () =>{
        var markers = [];
        allRoutes.forEach(element => {
            markers.push(element);
        });
        setRouteStartMarkers(markers);
        // console.log("Start markers", markers);
    }

    const addRouteMarkers = (routeID)=>{
        var markers = [];
        getContentForChannel(routeID).then(response => {
            var data = response.data;
            data.forEach(element => {
                // console.log(element);
                markers.push(element);
            });
            setRouteMarkers(markers);
        })
        // console.log("Route markers", markers);
    }

    const handleCommunity = (community) => {
        if(showRoutes) {
            setShowRoutes(false);
            setShowRouteMarkers(false);
        }
        else setShowRoutes(true);
        getAllRoutes(community.uniqueID);
        showStartMarkers();
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
                        <div>
                            <div onClick={()=>{setShowMenu(!showMenu)}}> <MenuIcon/> </div>
                            {showMenu && <Menu communities={allCommunity} selectCommunity={handleCommunity}/>}
                        </div>
                    </Box>
                    <Box sx={{ backgroundImage: COMPASS_ASSET, zIndex: 11, backgroundSize: "cover", width: 100, height: 100, zIndex: 2, position: 'absolute', top: '50px', right: '50px' }} />
                    {showRoutes && routeStartMarkers && routeStartMarkers.length != 0 && routeStartMarkers.map(marker => {
                        return (
                            <div className={'flex'}>
                                <Marker
                                    longitude={marker.long}
                                    latitude={marker.lat}
                                    onClick={()=>{addRouteMarkers(marker.uniqueID); setShowRouteMarkers(!showRouteMarkers)}}>
                                    <img src={require("../Assets/communityPointer.png")} alt={marker.uniqueID}/>
                                </Marker>
                            </div>);
                    })}
                    {showRouteMarkers && routeMarkers && routeMarkers.length != 0 && routeMarkers.map(marker => {
                        return (
                            <div className={'flex'}>
                                <Marker
                                    longitude={marker.long}
                                    latitude={marker.lat}>
                                    <img src={require(ROUTE_MARKER_IMG)} alt={marker.uniqueID}/>
                                </Marker>
                            </div>);
                    })}
                    <Box sx={{ position: 'absolute', bottom: "50px", left: "50px", zIndex: 10 }}>
                        <ZoomStepper zoom={MAP_ZOOM} />
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