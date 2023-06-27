import React, { useEffect, useState } from 'react';
import { INSET_MAP_OVERLAY_ASSET, ZOOM_IN_LIMIT, ZOOM_OUT_LIMIT, ARROW_NEXT_IMG, ARROW_PREV_IMG,} from '../../Constants/constants';
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
                <p className='briem-font text-[22px] text-[#000]' >
                    {marker.title}{marker.name}
                </p>
                <Button sx={{color:"black"}} onClick={onClose}> 
                    <Close></Close>
                </Button>
            </Stack>


            {marker.mediafile && marker.mediafile.formats && <img src={marker.mediafile.formats.large.url} style={{ height: "100px", marginTop: 5 }}></img>}
            <Divider></Divider>
            <Typography variant="subtitle2">Lorem ipsum dolor sit amet</Typography>
        </Box>
    )
}

export function CommunityPopup({ marker}) {
    return (
        <div className={"bg-cover bg-center h-[20px] bg-[url('../public/Assets/Images/inset_map_overlay.png')]"}>
            <p className='briem-font text-[16px] text-[#000]' >{marker.name}</p>
        </div>
    )
}

export function NextArrow() {
    return(
        <div className={"rounded-full cursor-pointer bg-cover w-[35px] h-[35px] bg-[url('../public/Assets/Images/arrowTexture.png')] flex justify-center items-center"}>
            <img className={'mt-1'} src={ARROW_NEXT_IMG} alt={'next'}/>
        </div>
    )
}
export function PrevArrow() {
    return(
        <div className={"rounded-full cursor-pointer bg-cover w-[35px] bg-[url('../public/Assets/Images/arrowTexture.png')] h-[35px] flex justify-center items-center"}>
            <img className={'mt-1'} src={ARROW_PREV_IMG} alt={'prev'}/>
        </div>
    )
}

