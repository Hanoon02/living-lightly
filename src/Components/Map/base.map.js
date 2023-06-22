import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { env_vars } from '../../Config/env';
import { Box } from '@mui/material';
import {
    COMPASS_ASSET,
    INSET_MAP_ZOOM,
    MAP_BOUNDS,
    MAP_CENTER,
    MAP_OVERLAY_ASSET,
    MAP_ZOOM,
    ZOOM_IN_LIMIT,
    ZOOM_OUT_LIMIT,
    ROUTE_MARKER_IMG,
} from '../../Constants/constants';
import {getContentForChannel, getSubChannel} from '../../Client/mvc.client';
import { Marker, Map, MapProvider, Source, Layer } from 'react-map-gl';
import { MapPopup, ZoomStepper, NextArrow, PrevArrow } from './components.map';
import { createLayer, createLineGeoJson, createPolygonLayer, createStatePolygon, getStateJson } from './utils.map';
import Menu from '../Menu/menu';
import MenuIcon from "@mui/icons-material/Menu";

mapboxgl.accessToken = env_vars.ACCESS_TOKEN


export default function BaseMap() {
    const [markers, setMarkers] = useState([]);
    const [showMarkers, setShowMarkers] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showPopup, setShowPopup] = useState(null);
    const [scopedMarker, setScopedMarker] = useState({});
    const mapRef = useRef(null);
    const [state, setState] = useState("")
    const [geojson, setGeoJson] = useState({});
    const [stGeojson, setStGeoJson] = useState({});


    const [allCommunity, setAllCommunity] = useState([]);
    const [allRoutes, setAllRoutes] = useState([]);
    const [routeStartMarkers, setRouteStartMarkers] = useState([]);
    const [routeMarkers, setRouteMarkers] = useState([]);
    const [showRoutes, setShowRoutes] = useState(false);
    const [showRouteMarkers, setShowRouteMarkers] = useState(false);

    useEffect(() => {
        getAllCommunities();
    }, [])

    const getAllCommunities = () => {
        var communities = [];
        console.log("ChannelID", env_vars.CHANNEL_ID);
        getSubChannel(env_vars.CHANNEL_ID).then(response => {
            var data = response.data;
            data.forEach(element => { communities.push(element);});
            setAllCommunity(communities);
        })
    }

    const getAllRoutes = (communityID) => {
        var routes = [];
        getSubChannel(communityID).then(response => {
            var data = response.data;
            data.forEach(element => {
                routes.push(element);
            });
            setAllRoutes(routes);
        })
    }

    const showStartMarkers = () =>{
        var markers = [];
        allRoutes.forEach(element => {
            markers.push(element);
        });
        setRouteStartMarkers(markers);
    }

    const addRouteMarkers = (routeID)=>{
        var markers = [];
        getContentForChannel(routeID).then(response => {
            var data = response.data;
            data.forEach(element => {markers.push(element);});
            setRouteMarkers(markers);
        })
    }
    const handleCommunity = (community) => {
        panTo([community.long, community.lat], 8);
        if(showRoutes) setShowRouteMarkers(false);
        setShowRoutes(!showRoutes);
        getAllRoutes(community.uniqueID);
        showStartMarkers();
    }

    const panOut = () => {
        panTo([MAP_CENTER.long, MAP_CENTER.lat], MAP_ZOOM);
    }

    useEffect(() => {
        getContentForChannel(env_vars.CHANNEL_ID).then(response => {
            setMarkers(response.data);
        })
    }, [])

    useEffect(() => {
        if (routeMarkers && routeMarkers.length > 0) {
            setGeoJson(createLineGeoJson(routeMarkers))
        }
    }, [routeMarkers])

    const updateState = (center) => {
        const gjson = getStateJson(center)
        if(gjson){
            setState(gjson.properties.NAME_1)
            setStGeoJson(gjson)
        }
    }

    useEffect(() => {
        updateState([MAP_CENTER.long, MAP_CENTER.lat])
    }, [])




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
                    onMoveEnd={(e) => { updateState([e.viewState.longitude, e.viewState.latitude]) }}
                    maxBounds={MAP_BOUNDS}
                    ref={mapRef}
                    style={{ zIndex: 0, opacity: 0.5 }}
                    mapStyle={env_vars.MAP_STYLE}
                    mapboxAccessToken={env_vars.ACCESS_TOKEN}
                >;
                    <Box sx={{ position: 'absolute', top: "50px", left: "80px", zIndex: 10 }}>
                        <div>
                            <div onClick={()=>{setShowMenu(!showMenu)}}> <MenuIcon/> </div>
                            {showMenu && <Menu communities={allCommunity} selectCommunity={handleCommunity}/>}
                        </div>
                        {/* <PrevArrow/> */}
                        {/* <NextArrow/> */}

                    </Box>
                    {showRoutes && routeStartMarkers && routeStartMarkers.length != 0 && routeStartMarkers.map(marker => {
                        return (
                            <div className={'flex'}>
                                <Marker
                                    longitude={marker.long}
                                    latitude={marker.lat}
                                    onClick={()=>{
                                        if(!showRouteMarkers) panTo([marker.long, marker.lat], 8);
                                        setShowMarkers(true); addRouteMarkers(marker.uniqueID);
                                        setShowRouteMarkers(!showRouteMarkers)}}
                                    >
                                    <img src={require("./Assets(temp)/routeStart.png")} alt={marker.uniqueID} style={{ height: "40px" }}/>
                                </Marker>
                            </div>);
                    })}
                    {showRouteMarkers && routeMarkers && routeMarkers.length != 0 && routeMarkers.map(marker => {
                        return (
                            <div className={'flex'}>
                                <Marker
                                    longitude={marker.long}
                                    latitude={marker.lat}>
                                    <img src={require("./Assets(temp)/routePointer.png")} alt={marker.uniqueID}/>
                                </Marker>
                            </div>);
                    })}
                    <Source id="routes" type="geojson" data={geojson}>
                        {showRouteMarkers && <Layer {...createLayer()}></Layer>}
                        <Box sx={{ backgroundImage: COMPASS_ASSET, zIndex: 11, backgroundSize: "cover", width: 100, height: 100, zIndex: 2, position: 'absolute', top: '50px', right: '50px' }} />
                        {showRouteMarkers && routeMarkers && routeMarkers.length != 0 && routeMarkers.map(marker => {
                            return (
                                <div>
                                    <Marker
                                        longitude={marker.long}
                                        latitude={marker.lat}
                                        onClick={() => {
                                            panTo([marker.long, marker.lat], 10)
                                            setScopedMarker(marker)
                                            setShowPopup(true)
                                        }
                                        }
                                    >
                                        {(scopedMarker.lat == marker.lat && scopedMarker.long == marker.long) ? <img src={require("./Assets(temp)/routePointer.png")} style={{ height: "40px" }}></img> : <img src={require("./Assets(temp)/routePointer.png")} style={{ height: "32px" }}></img>}
                                    </Marker>
                                </div>);
                        })}
                        {showPopup && <MapPopup marker={scopedMarker} onClose={() => { setShowPopup(false) }} />}
                        <Box sx={{ position: 'absolute', bottom: "50px", left: "50px", zIndex: 10 }}>
                            <ZoomStepper zoom={MAP_ZOOM} />
                        </Box>
                        {/*<Box sx={{ position: 'absolute', bottom: "100px", left: "50px", zIndex: 10 }}>*/}
                        {/*    <p variant="h3" onClick={() => {*/}
                        {/*        if (markers && markers.length != 0) {*/}
                        {/*            panTo([markers[0].long, markers[0].lat], 8)*/}
                        {/*            setShowMarkers(true)*/}
                        {/*        }*/}

                        {/*    }} className={'ml-5 mb-5 text-[30px] text-[#000] cursor-pointer briem-font'}> Van Gujjars of Uttarakhand </p>*/}
                        {/*</Box>*/}
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
                                <Source id={"state"} type="geojson" data={stGeojson} >
                                    <Layer {...createPolygonLayer()} />
                                </Source>
                            </Map>
                        </Box>
                    </Source>

                </Map>
            </Box>
        </MapProvider>


    );
}