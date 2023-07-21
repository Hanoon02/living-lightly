import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

export const getPopup = (marker) => {
    return marker.mediafile && marker.mediafile.formats ? new mapboxgl.Popup().setHTML(`
                                    <div className={"px-5 py-2 bg-center bg-no-repeat bg-[url('../public/Assets/Images/inset_map_overlay.png')]"}>
                                    <Stack direction="row" style={{ marginTop: 1 }} justifyContent="space-between" alignItems="center">
                                    <p className='briem-font text-[26px] text-[#000]' >
                                        ${marker.title}
                                    </p>
                                    </Stack>
                                    <img src=${marker.mediafile.formats.large.url} style={{ height: "100px", marginTop: 5 }}></img>
                                    <Divider></Divider>
                                    </div>`) :
        new mapboxgl.Popup().setHTML(`
                                    <div className={"px-5 py-2 bg-center bg-no-repeat bg-[url('../public/Assets/Images/inset_map_overlay.png')]"}>
                                    <Stack direction="row" style={{ marginTop: 1 }} justifyContent="space-between" alignItems="center">
                                    <p className='briem-font text-[22px] text-[#000]' >
                                        ${marker.title}
                                    </p>
                                    </Stack>
                                    <Divider></Divider>
                                    </div>`)
}

export const getPopupHTML = (marker) => {
    return marker.mediafile && marker.mediafile.formats ? `
                                    <div className={"px-5 py-2 bg-center bg-no-repeat bg-[url('../public/Assets/Images/inset_map_overlay.png')]"}>
                                    <Stack direction="row" style={{ marginTop: 1 }} justifyContent="space-between" alignItems="center">
                                    <p className='briem-font text-[26px] text-[#000]' >
                                        ${marker.title}
                                    </p>
                                    </Stack>
                                    <img src=${marker.mediafile.formats.large.url} style={{ height: "100px", marginTop: 5 }}></img>
                                    <Divider></Divider>
                                    </div>` :
        `
                                    <div className={"px-5 py-2 bg-center bg-no-repeat bg-[url('../public/Assets/Images/inset_map_overlay.png')]"}>
                                    <Stack direction="row" style={{ marginTop: 1 }} justifyContent="space-between" alignItems="center">
                                    <p className='briem-font text-[22px] text-[#000]' >
                                        ${marker.title}
                                    </p>
                                    </Stack>
                                    <Divider></Divider>
                                    </div>`
}