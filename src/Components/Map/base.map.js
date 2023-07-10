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
    ROUTE_START_IMG,
    ROUTE_POINTER_IMG,

} from '../../Constants/constants';
import { getContentForChannel, getSubChannel } from '../../Client/mvc.client';
import { Marker, Map, MapProvider, Source, Layer, Popup } from 'react-map-gl';
import { MapPopup, ZoomStepper, NextArrow, ExitArrow, PrevArrow, CommunityPopup } from './components.map';
import { createLayer, createLineGeoJson, createPolygonLayer, createStatePolygon, getStateJson } from './utils.map';
import Menu from '../Menu/menu';
import MenuIcon from "@mui/icons-material/Menu";

import { createRoot } from 'react-dom/client';

mapboxgl.accessToken = env_vars.ACCESS_TOKEN


export default function BaseMap() {
    const [showMenu, setShowMenu] = useState(false);
    const [showPopup, setShowPopup] = useState(null);
    const [scopedMarker, setScopedMarker] = useState({});
    const mapRef = useRef(null);
    const [state, setState] = useState("")
    const [geojson, setGeoJson] = useState({});
    const [stGeojson, setStGeoJson] = useState({});
    const [mapData, setMapData] = useState({});
    const [allCommunity, setAllCommunity] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [routeStartMarkers, setRouteStartMarkers] = useState([]);
    const [routeMarkers, setRouteMarkers] = useState([]);
    const [showRoutes, setShowRoutes] = useState(false);
    const [showRouteMarkers, setShowRouteMarkers] = useState(false);

    useEffect(() => {
        getAllMapData();
    }, [])

    const getAllMapData = () => {
        var mapTempData = {};
        getSubChannel(env_vars.CHANNEL_ID).then(response => {
            const data = response.data;
            var allCommunities = [];
            data.forEach(element => {
                const elementContent = JSON.stringify(element);
                mapTempData[elementContent] = {};
                allCommunities.push(element);
                getSubChannel(element.uniqueID).then(response => {
                    const routesData = response.data;
                    routesData.forEach(route => {
                        const routeContent = JSON.stringify(route);
                        mapTempData[elementContent][routeContent] = {};
                        getContentForChannel(route.uniqueID).then(response => {
                            const markersData = response.data;
                            var allMarkers = []
                            markersData.forEach(marker => {
                                allMarkers.push(marker);
                            })
                            mapTempData[elementContent][routeContent] = allMarkers;
                        })
                    })
                })
            });
            setMapData(mapTempData);
            setAllCommunity(allCommunities);
        })
    }

    function returnTitle(community) {
        var title = community.split("-").join(" ");
        return title;
    }

    const getRouteMarkers = (community, route) => {
        var routeMarkersTemp = [];
        for (const [key1, value1] of Object.entries(mapData)) {
            var data1 = JSON.parse(key1);
            if (data1.name === community) {
                for (const [key2, value2] of Object.entries(value1)) {
                    var data2 = JSON.parse(key2);
                    if (data2.name === route) {
                        for (const [key3, value3] of Object.entries(value2)) {
                            routeMarkersTemp.push(value3);
                        }
                    }
                }
            }
        }
        setRouteMarkers(routeMarkersTemp);
    }

    const getRouteStartMarkers = (community) => {
        var data = {};
        var allRouteStartMarkers = [];
        for (const [key, values] of Object.entries(mapData)) {
            data = JSON.parse(key);
            if (data.name === community) {
                for (const [key, value] of Object.entries(values)) {
                    const start = JSON.parse(key);
                    allRouteStartMarkers.push(start);
                }
            }
        }
        setRouteStartMarkers(allRouteStartMarkers);
    }

    const handleCommunity = (community) => {
        if (showRoutes) setShowRouteMarkers(false);
        if (routeStartMarkers.length !== 0) setShowRoutes(!showRoutes);
        getRouteStartMarkers(community);
        if (routeStartMarkers.length !== 0) {
            fixZoom(8);
            mapRef.current.getMap().setCenter([routeStartMarkers[0].long, routeStartMarkers[0].lat]);
        }
    }

    useEffect(() => {
        if (routeMarkers && routeMarkers.length > 0) {
            setGeoJson(createLineGeoJson(routeMarkers))
        }
    }, [routeMarkers])

    const updateState = (center) => {
        const gjson = getStateJson(center)
        if (gjson) {
            setState(gjson.properties.NAME_1)
            setStGeoJson(gjson)
        }
    }

    useEffect(() => {
        updateState([MAP_CENTER.long, MAP_CENTER.lat])
    }, [])



    const exit = () => {
        setShowMenu(false);
        if (showRouteMarkers) {
            fixZoom(8);
            setShowRouteMarkers(false);
            panTo([routeStartMarkers[0].long, routeStartMarkers[0].lat], 8);
        }
        else {
            fixZoom(0);
            if (showRoutes) setShowRouteMarkers(false);
            setShowRoutes(!showRoutes);
            panTo([selectedCommunity.long, selectedCommunity.lat], 8);
        }
    }

    const panTo = (coords, zoom) => {
        if (mapRef.current) {
            mapRef.current.flyTo(
                {
                    center: coords, zoom: zoom,
                    speed: 10.8,
                    curve: 1,
                    easing(t) {
                        return t;
                    }
                },
            )
        }
    }

    const fixZoom = (zoom) => {
        const map = mapRef.current.getMap();
        map.setMinZoom(zoom);
    }

    const scroll = (direction) => {
        var nextMarker;
        const indexOfScopedMarker = routeMarkers.indexOf(scopedMarker);
        if (direction === 1) { //Which means to the next one
            if (indexOfScopedMarker === routeMarkers.length - 1) nextMarker = 0;
            else nextMarker = Math.min(indexOfScopedMarker + 1, routeMarkers.length - 1);
        } else { // Which means the previous one
            if (indexOfScopedMarker === 0) nextMarker = routeMarkers.length - 1;
            else nextMarker = Math.max(indexOfScopedMarker - 1, 0);
        }
        setScopedMarker(routeMarkers[nextMarker]);
        mapRef.current.getMap().setCenter([routeMarkers[nextMarker].long, routeMarkers[nextMarker].lat]);
    }


    return (

        <>
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
                            <div className={'flex justify-start items-center gap-5'}>
                                <div onClick={() => { setShowMenu(!showMenu) }}> <MenuIcon /> </div>
                                {(showRoutes && routeStartMarkers && routeStartMarkers.length != 0) && <div onClick={() => exit()}><ExitArrow /></div>}
                            </div>
                            {showMenu && <Menu selectCommunity={handleCommunity} mapData={mapData} />}
                        </div>
                    </Box>
                    {showRoutes && (routeMarkers.length === 0 || !showRouteMarkers) && routeStartMarkers && routeStartMarkers.length != 0 &&
                        routeStartMarkers.map(marker => {
                            return (
                                <div className={"flex "}>
                                    <Marker
                                        longitude={marker.long}
                                        latitude={marker.lat}
                                        onClick={() => {
                                            if (!showRouteMarkers) panTo([marker.long, marker.lat], 9.8);
                                            getRouteMarkers(selectedCommunity.name, marker.name);
                                            setShowRouteMarkers(!showRouteMarkers)
                                            fixZoom(9.8);
                                            mapRef.current.getMap().setCenter([marker.long, marker.lat]);
                                        }}
                                    >
                                        <div className={'cursor-pointer '}>
                                            <img
                                                onMouseEnter={() => { setScopedMarker(marker); setShowPopup(true); }}
                                                onMouseLeave={() => { setShowPopup(false); }}
                                                className={'shadow-2xl'}
                                                src={ROUTE_START_IMG} alt={marker.uniqueID} style={{ height: "40px" }}
                                            />
                                        </div>
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

                                        popup={new mapboxgl.Popup().setHTML(`
                                    <div className={"px-5 py-2 bg-center bg-no-repeat bg-[url('../public/Assets/Images/inset_map_overlay.png')]"}>
                                        ${marker.title}
                                        </p></div>`)}
                                    >

                                        <div className={'cursor-pointer flex flex-col justify-center'}
                                        >
                                            {(scopedMarker.lat == marker.lat && scopedMarker.long == marker.long) ?
                                                <>
                                                    <img src={ROUTE_POINTER_IMG} className={'mx-auto w-[30px] h-[40px]'} />
                                                    <p className={'briem-font text-[#894E35] text-[18px]'}>{marker.title}</p>
                                                </> :
                                                <>
                                                    <img src={ROUTE_POINTER_IMG} className={'mx-auto w-[20px] h-[30px]'} />
                                                    <p className={'hover:underline-offset-2 hover:underline briem-font text-[#894E35] text-[14px]'}>{marker.title}</p>
                                                </>
                                            }
                                        </div>
                                    </Marker>
                                </div>);
                        })}
                        {showPopup &&
                            <Popup
                                longitude={scopedMarker.long}
                                latitude={scopedMarker.lat}
                                offset={20}

                            >
                                <MapPopup marker={scopedMarker} />
                            </Popup>
                        }
                        <Box sx={{ position: 'absolute', bottom: "100px", right: "90px", zIndex: 10 }}>
                            <ZoomStepper zoom={MAP_ZOOM} />
                        </Box>
                        {showRouteMarkers &&
                            <>
                                <Box sx={{ position: 'absolute', bottom: "50px", left: "80px", zIndex: 10 }}>
                                    <div onClick={() => scroll(-1)}><PrevArrow /></div>
                                </Box>
                                <Box sx={{ position: 'absolute', bottom: "50px", right: "125px", zIndex: 10 }}>
                                    <div onClick={() => scroll(1)}><NextArrow /></div>
                                </Box>
                            </>
                        }
                        {(routeStartMarkers.length === 0 || !showRoutes) && allCommunity.map((community, index) => {
                            return (
                                <Box>
                                    <Marker
                                        longitude={community.long}
                                        latitude={community.lat}>
                                        <p onClick={() => {
                                            panTo([community.long, community.lat], 8);
                                            handleCommunity(community.name);
                                            setSelectedCommunity(community);
                                        }}
                                            onMouseEnter={() => { setScopedMarker(community); setShowPopup(true); }}
                                            onMouseLeave={() => { setShowPopup(false); }}
                                            style={{ "text-transform": "capitalize" }}
                                            className={'z-50 shadow-2xl font-[900] ml-5 mb-5 text-[20px] text-[#356693] cursor-pointer briem-font'}> {returnTitle(community.name)} </p>
                                    </Marker>
                                </Box>);
                        })}
                        <Box sx={{ backgroundImage: MAP_OVERLAY_ASSET, zIndex: 5, border: 1, borderStyle: 'dashed', borderRadius: 1, borderColor: "brown", width: 100, height: 100, zIndex: 2, position: 'absolute', bottom: '150px', right: '100px' }}>
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
        </>
    );
}