import React, { useRef, useState, useEffect } from "react"
import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import { Coordinate } from "ol/coordinate";
import View from "ol/View";

interface MapProps {
    children: React.ReactNode;
    zoom: number;
    center: Coordinate;
}

export const Map: React.FC<MapProps> = ({ children, zoom, center }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<ol.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const view = new View({ zoom, center });

        let mapObject = new ol.Map({
            view: view,
            layers: [],
            controls: [],
            overlays: []
        })

        mapObject.setTarget(mapRef.current);
        setMap(mapObject);

        return () => mapObject.setTarget(undefined);
    }, [ zoom, center ]);

    useEffect(() => {
        if (map) {
            map.getView().setZoom(zoom);
        }
    }, [zoom, map]);

    useEffect(() => {
        if (map) {
            map.getView().setCenter(center);
        }
    }, [center, map]);

    return (
        <MapContext.Provider value={{ map, setMap }}>
            <div ref={mapRef} className="ol-map">
                {children}
            </div>
        </MapContext.Provider>
    )
}