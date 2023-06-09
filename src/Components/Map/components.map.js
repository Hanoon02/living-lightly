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
                    setZoomLevel(Math.min(zoomLevel + 2, ZOOM_IN_LIMIT))

                }}>
                <Add />
            </Button>
            <Button color="info" sx={{
                backgroundColor: "goldenrod", ':hover': {
                    backgroundColor: "goldenrod",
                    opacity: 0.5,
                }
            }} onClick={() => {
                setZoomLevel(Math.max(zoomLevel - 2, ZOOM_OUT_LIMIT))
            }}>
                <Remove />
            </Button>
        </ButtonGroup>
    )

}

export function MapPopup({ marker, showArrows, leftArrow, rightArrow }) {
    return (

        <div className={"px-5 py-2 bg-center bg-no-repeat bg-[url('../public/Assets/Images/inset_map_overlay.png')]"}>
            <Stack direction="row" style={{ marginTop: 1 }} justifyContent="space-between" alignItems="center">
                <p className='briem-font text-[22px] text-[#000]' >
                    {marker.title}{marker.name}
                </p>
            </Stack>
            {marker.mediafile && marker.mediafile.formats && <img src={marker.mediafile.formats.large.url} style={{ height: "100px", marginTop: 5 }}></img>}
            <Divider></Divider>
            <Typography variant="subtitle2">Lorem ipsum dolor sit amet</Typography>
            {showArrows && <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                <Button onClick={leftArrow} sx={{ backgroundColor: "goldenrod", ':hover': { backgroundColor: "goldenrod", opacity: 0.5, } }}><img src={ARROW_PREV_IMG} alt={'prev'} /></Button>
                <Button onClick={rightArrow} sx={{ backgroundColor: "goldenrod", ':hover': { backgroundColor: "goldenrod", opacity: 0.5, } }}><img src={ARROW_NEXT_IMG} alt={'next'} /></Button>
            </Box>}
        </div>
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
export function ExitArrow() {
    return(
        <div className={"text-[20px] font-[500] rounded-xl cursor-pointer w-[55px] h-[35px] flex justify-center items-center"}>
            Back
        </div>
    )
}

