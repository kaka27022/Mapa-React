import React, { useContext, useEffect } from "react";
import MapContext from "../Map/MapContext";
import OLVectorLayer from "ol/layer/Vector";
import { Vector as VectorSource } from "ol/source";
import { Style } from "ol/style"

interface VectorLayerProps {
    source: VectorSource;
    style?: Style | Style[];
    zIndex?: number;
}

export const VectorLayer: React.FC<VectorLayerProps> = ({ source, style, zIndex = 0}) => {
    const { map } = useContext(MapContext);

    useEffect(() => {
        if (!map) return;

        const vectorLayer = new OLVectorLayer({
            source,
            style
        });

        map.addLayer(vectorLayer);
        vectorLayer.setZIndex(zIndex);

        return () => {
            if (map) {
                map.removeLayer(vectorLayer);
            }
        };
    }, [map, source, style, zIndex]);

    return null;
}