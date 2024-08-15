import React, { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLTileLayer from "ol/layer/Tile";
import { XYZ, OSM } from "ol/source";

interface TileLayersProps {
    source: XYZ | OSM;
    zIndex?: number;
}

export const TileLayers: React.FC<TileLayersProps> = ({ source, zIndex = 0 }) => {
    const { map } = useContext(MapContext);

    useEffect(() => {
        if (!map) return;

        const tileLayer = new OLTileLayer({
            source,
            zIndex
        });

        map.addLayer(tileLayer);
        tileLayer.setZIndex(zIndex);
        return () => {
            if (map) {
                map.removeLayer(tileLayer);
            }
        };
    }, [map, source, zIndex]);

    return null;
}