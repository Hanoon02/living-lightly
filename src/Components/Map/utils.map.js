import json from '../../Constants/states_geojson.json'
import { geoContains } from 'd3-geo'
export function createLineGeoJson(route_markers) {
    return {
        'id': 'routes',
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': route_markers.sort((marker1, marker2) =>
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
            'line-width': 2
        }
    };

}

export function createStatePolygon(state) {
    const stateJson = json.features.filter(elem => elem.properties.NAME_1 == state)[0]
    return {
        ...stateJson
    }
}

export function createPolygonLayer() {
    return {
        'id': "state",
        'type': 'fill',
        'source': "state", // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
        }
    }
}

export function getStateJson(center) {
    var obj = json.features.filter(elem => geoContains(elem,center))[0]
    if(typeof(obj)!="undefined") obj["id"] = "state"
    return obj
}