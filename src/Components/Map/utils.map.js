export function createLineGeoJson(route_markers) {
    return {
        'id': 'routes',
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': route_markers.sort((marker1,marker2)=>
                marker1.lat - marker2.lat
            ).reduce((acc, marker) => {
                acc.push([
                    marker.long,
                    marker.lat
                ]);
                return acc;
            }, [])
        }


    };
}

export function createLayer() {
    return {
        'id': 'routes',
        'type': 'line',
        'source': 'routes',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#000',
            'line-width': 10
        }
    };

}