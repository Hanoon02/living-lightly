import React, { useRef, useEffect, useState } from 'react';
import { INSET_MAP_OVERLAY_ASSET, ZOOM_IN_LIMIT, ZOOM_OUT_LIMIT } from '../../Constants/constants';
import { ButtonGroup, Button, Box, Typography, Divider } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useMap } from 'react-map-gl';
export function ZoomStepper({ zoom }) {

    const { current: map } = useMap();

    const [zoomLevel, setZoomLevel] = useState(zoom)


    useEffect(() => {
        map.zoomTo(zoomLevel)
    }, [zoomLevel])

    return (
        <ButtonGroup variant="contained">
            <Button color="info"
                sx={{

                    backgroundColor: "goldenrod", ':hover': {
                        backgroundColor: "goldenrod",
                        opacity: 0.5,
                    }
                }} onClick={() => {
                    setZoomLevel(Math.min(zoomLevel + 1, ZOOM_IN_LIMIT))

                }}>
                <Add />
            </Button>
            <Button color="info" sx={{
                backgroundColor: "goldenrod", ':hover': {
                    backgroundColor: "goldenrod",
                    opacity: 0.5,
                }
            }} onClick={() => {
                setZoomLevel(Math.max(zoomLevel - 1, ZOOM_OUT_LIMIT))
            }}>
                <Remove />
            </Button>
        </ButtonGroup>
    )

}

export function MapPopup({marker}){
    return (

        <Box sx={{position:"absolute", bottom:"200px", right:"200px", backgroundSize:"cover", backgroundImage:INSET_MAP_OVERLAY_ASSET, width:400, height:400, zIndex:15}}>
            <Typography gutterBottom variant="h6" className='font-face'>{marker.title}</Typography>
            <img src={marker.mediafile.formats.large.url} style={{height:"100px"}}></img>
            <Divider></Divider>
            <Typography variant="subtitle2">Lorem ipsum dolor sit amet</Typography>
        </Box>
    )
}