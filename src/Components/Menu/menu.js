import React, {useState} from "react";

export default function Menu({communities, selectCommunity}) {
    const [showCommunities, setShowCommunities] = useState(false);
    const [showThemes, setShowThemes] = useState(false);

    function returnTitle(community){
        var title = community.split("-").join(" ");
        return title;
    }

    return(
        <>
            <div className={'flex text-[20px] pt-3'}>
                <div className={'px-1'}>
                    <div onClick={()=>{setShowCommunities(!showCommunities); setShowThemes(false)}}>
                        <p className={'py-1'}>Communities</p>
                    </div>
                    <div onClick={()=>{setShowThemes(!showThemes); setShowCommunities(false)}}>
                        <p className={'py-1'}>Themes</p>
                    </div>
                </div>
                <div>
                    {showCommunities &&
                        <div className={'py-1'}>
                            {communities.map((community, index) => {
                                return(
                                    <div key={index} onClick={()=>{selectCommunity(community)}}>
                                        <p>{returnTitle(community.name)}</p>
                                    </div>
                                )
                            })}
                        </div>}
                    {showThemes &&
                        <div>
                            <p>Relations with villagers</p>
                            <p>Relations with state</p>
                            <p>Relations with communities</p>
                            <p>Relations with ration shop owners</p>
                        </div>}
                </div>
            </div>
        </>
    )
}