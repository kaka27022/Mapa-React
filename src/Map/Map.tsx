import React, { useRef, useEffect, useState } from "react"
import "./Map.css";
import { useMapContext } from "./MapContext";
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
    const { setMap, setIsMapReady } = useMapContext();
    const [map, setLocalMap] = useState<ol.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            const view = new View({ zoom, center });

            const mapObject = new ol.Map({
                view: view,
                layers: [],
                controls: [],
                overlays: [],
            });

            mapObject.setTarget(mapRef.current);
            setLocalMap(mapObject);
            setMap(mapObject);
            setIsMapReady(true);

            console.log('Mapa inicializando');

            return () => {
                console.log('Mapa desmontando');
                mapObject.setTarget(undefined);
                setIsMapReady(false);
            };
        }
    }, [zoom, center, setMap, setIsMapReady]);

    useEffect(() => {
        if (map) {
            map.getView().setZoom(zoom);
            map.getView().setCenter(center);
        }
    }, [zoom, center, map]);

    return (
        <div ref={mapRef} className="ol-map">
            {children}
        </div>
    )
}