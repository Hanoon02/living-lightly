import React, { useState } from "react";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";

export default function Menu({ communities, selectCommunity }) {
    const [showCommunities, setShowCommunities] = useState(false);
    const [showThemes, setShowThemes] = useState(false);

    function returnTitle(community) {
        var title = community.split("-").join(" ");
        return title;
    }

    return (
        <>
            <div className={'flex text-[20px] pt-3 briem-font'}>
                <div className={'divide-y-2 divide-black divide-dashed px-5 bg-[#F8F3E3] rounded-xl shadow-lg briem-font'}>
                    <div><button onClick={() => { setShowCommunities(!showCommunities); setShowThemes(false) }}>
                        <div className={'flex py-3'}><p className={'px-1'}>Communities </p>
                            <ArrowIcon /></div>
                    </button>
                    </div>
                    <div><button onClick={() => { setShowThemes(!showThemes); setShowCommunities(false) }}>
                        <div className={'flex py-3'}><p className={'px-1'}>Themes </p>
                            <ArrowIcon /></div>
                    </button>
                    </div>
                </div>
                <div className={'mx-3'}>
                    {showCommunities &&
                        <div className={'bg-[#F8F3E3] py-2 px-5 rounded-xl shadow-lg briem-font'}>
                            {communities.map((community, index) => {
                                return (
                                    <button key={index} onClick={() => { selectCommunity(community) }}>
                                        <p style={{"text-transform": "capitalize"}}>{returnTitle(community.name)}</p>
                                    </button>
                                )
                            })}
                        </div>}
                    {showThemes &&
                        <div className={'bg-[#F8F3E3] py-2 px-5 rounded-xl shadow-lg briem-font'}>
                            <p className={'py-2'}>Relations with villagers</p>
                            <hr className={'border border-3 border-white briem-font'} />
                            <p className={'py-2'}>Relations with state</p>
                            <hr className={'border border-3 border-white briem-font'} />
                            <p className={'py-2'}>Relations with communities</p>
                            <hr className={'border border-3 border-white briem-font'} />
                            <p className={'py-2'}>Relations with ration shop owners</p>
                        </div>}
                </div>
            </div>
        </>
    )
}