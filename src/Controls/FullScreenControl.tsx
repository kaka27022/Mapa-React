import React, { useContext, useEffect } from "react";
import { FullScreen } from "ol/control";
import MapContext from "../Map/MapContext";
import { Map as OlMap } from "ol";

interface MapContextType {
    map: OlMap | null;
}

export const FullScreenControl: React.FC = () => {
    const { map } = useContext(MapContext) as MapContextType;

    useEffect(() => {
        if (!map) return;

        const fullScreenControl = new FullScreen({});
        map.addControl(fullScreenControl);

        return () => {
            if (map) {
                map.removeControl(fullScreenControl);
            }
        };
    }, [map]);
    return null;
};
