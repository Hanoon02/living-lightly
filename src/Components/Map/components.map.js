import React, { useEffect, useState } from 'react';
import { INSET_MAP_OVERLAY_ASSET, ZOOM_IN_LIMIT, ZOOM_OUT_LIMIT } from '../../Constants/constants';
import { ButtonGroup, Button, Box, Typography, Divider, Stack} from '@mui/material';
import { Add, Remove, Close } from '@mui/icons-material';
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

export function MapPopup({ marker, onClose }) {
    return (

        <Box sx={{ padding: 5, position: "absolute", bottom: "200px", right: "200px", backgroundSize: "400px 400px", backgroundImage: INSET_MAP_OVERLAY_ASSET, width: 400, height: 400, zIndex: 15, alignItems: "center" }}>
            <Stack direction="row" style={{ marginTop: 1 }} justifyContent="space-between" alignItems="center">
                <p className='briem-font text-[22px] text-[#000]' >{marker.title}</p>
                <Button sx={{color:"black"}} onClick={onClose}> 
                    <Close></Close>
                </Button>
            </Stack>


            <img src={marker.mediafile.formats.large.url} style={{ height: "100px", marginTop: 5 }}></img>
            <Divider></Divider>
            <Typography variant="subtitle2">Lorem ipsum dolor sit amet</Typography>
        </Box>
    )
}

export function NextArrow() {
    return(
        <div>
            <p className={'text-[500px]'}>-?</p>
            <img src={'./arrow.png'} className={'w-10 h-10'}/>
        </div>
    )
}
export function PrevArrow() {
    return(
        <div>
            <p className={'text-[500px]'}> ?- </p>
            <img src={'./arrow.png'} className={'w-10 h-10'}/>
        </div>
    )
}

