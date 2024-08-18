import React, { useState } from 'react';
import { MapProvider, useMapContext } from './Map/MapContext'; 
import { Map } from './Map/Map';
import { Layers } from './Layers/Layers';
import { TileLayers } from './Layers/TileLayer';
import { VectorLayer } from './Layers/VactorLayer';
import { Controls } from './Controls/Constrols';
import { FullScreenControl } from './Controls/FullScreenControl';
import { InputField, StyledH1, WhiteRectangle } from './styles/general';
import { fromLonLat } from 'ol/proj';
import { OSM, Vector } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import "./App.css";
import { geocode } from './geocode';
import createRoute from './drawRoute';

const MapComponents: React.FC = () => {
    const { map, isMapReady } = useMapContext();
    const [origin, setOrigin] = useState<string>('');
    const [destination, setDestination] = useState<string>('');

    const handleCreateRoute = async () => {
        if (!isMapReady || !map) {
            alert('O mapa não está disponível.');
            return;
        }

        const originCoords = await geocode(origin);
        const destinationCoords = await geocode(destination);

        console.log("Origem:", originCoords);
        console.log("Destino:", destinationCoords);

        if (originCoords && destinationCoords) {
            createRoute(map, originCoords, destinationCoords);
        } else {
            alert('Endereços não encontrados.');
        }
    }

    return (
        <>
            <WhiteRectangle>
                <StyledH1>Origem:</StyledH1>
                <InputField
                    type='text'
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder='Digite o local de origem'
                />

                <StyledH1>Destino:</StyledH1>
                <InputField
                    type='text'
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder='Digite o local de destino'
                />

                <button onClick={handleCreateRoute}>Criar Rota</button>
            </WhiteRectangle>
        </>
    );
}

function App() {
    const center = fromLonLat([-43.5300, -20.3833]); 
    const zoom = 12;

    const vectorSource = new Vector({
        features: new GeoJSON().readFeatures({
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: fromLonLat([-43.5300, -20.3833]),
                    },
                    properties: {},
                },
            ],
        }),
    });

    const pointStyle = new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: 'red' }),
            stroke: new Stroke({ color: 'black', width: 2 }),
        }),
    });

    return (
        <MapProvider>
            <MapComponents />
            <div style={{ height: '500px', width: '100%' }}>
                <Map zoom={zoom} center={center}>
                    <Controls>
                        <FullScreenControl />
                    </Controls>
                    <Layers>
                        <TileLayers source={new OSM()} />
                        <VectorLayer source={vectorSource} style={pointStyle} />
                    </Layers>
                </Map>
            </div>
        </MapProvider>
    );
}

export default App;

