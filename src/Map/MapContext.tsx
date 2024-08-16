import React, { createContext, useContext, ReactNode, useState } from 'react';
import * as ol from "ol"

// Definir tipo do valor do contexto
interface MapContextType {
    map: ol.Map | null;
    setMap: (map: ol.Map | null ) => void; 
    isMapReady: boolean;
    setIsMapReady: (isMapReady: boolean) => void;
}

// Criar o contexto
const MapContext = createContext<MapContextType | undefined>(undefined);

// Cirar provedor pra contexto
export const MapProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [map, setMap] = useState<ol.Map | null>(null);
    const [isMapReady, setIsMapReady] = useState<boolean>(false);

    return (
        <MapContext.Provider value={{ map, setMap, isMapReady, setIsMapReady }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
}

export default MapContext;

