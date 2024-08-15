import React, { createContext, useContext, ReactNode } from 'react';
import * as ol from "ol"

// Definir tipo do valor do contexto
interface MapContextType {
    map: ol.Map | null;
    setMap: (map: ol.Map | null ) => void; 
}

// Valor padrao do contexto
const defaultValue: MapContextType = {
    map: null,
    setMap: () => {},
};

// Criar o contexto
const MapContext = createContext<MapContextType>(defaultValue);

interface MapProviderProps {
    children: ReactNode;
}

// Cirar provedor pra contexto
export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
    const [map, setMap] = React.useState<ol.Map | null>(null);

    return (
        <MapContext.Provider value={{ map, setMap }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = () => useContext(MapContext);

export default MapContext;

