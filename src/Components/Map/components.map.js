import React, { useRef, useEffect, useState } from 'react';
import { ZOOM_IN_LIMIT, ZOOM_OUT_LIMIT } from '../../Constants/constants';
import { ButtonGroup, Button } from '@mui/material';
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