import React from "react";

export default function MapPopup({title, description, thumbnail}) {
    return(
        <>
            <div>
                <p>{title}</p>
                <p>{description}</p>
                {thumbnail && <img src={thumbnail} alt={title}/>
            </div>
        </>
    )
}