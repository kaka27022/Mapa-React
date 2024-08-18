import React, { useState } from 'react';
import { MapProvider, useMapContext } from './Map/MapContext'; 
import { Map } from './Map/Map';
import { Layers } from './Layers/Layers';
import { TileLayers } from './Layers/TileLayer';
import VectorLayer from 'ol/layer/Vector';
import { Controls } from './Controls/Constrols'; // Corrigido o nome do arquivo
import { FullScreenControl } from './Controls/FullScreenControl';
import { InputField, StyledH1, WhiteRectangle } from './styles/general';
import { fromLonLat } from 'ol/proj';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import "./App.css";
import { Feature } from 'ol'
import { Point } from 'ol/geom';
import { geocode } from './geocode';
import createRoute from './drawRoute';

const createMarkerStyle = (color: string) => new Style({
    image: new CircleStyle({
        radius: 20,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: 'black', width: 2 }),
    }),
});

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
            const routeStartCoords = fromLonLat(originCoords) as [number, number];
            const routeEndCoords = fromLonLat(destinationCoords) as [number, number];

            // Cria a rota no mapa
            createRoute(map, originCoords, destinationCoords);

            // Adiciona marcadores para origem e destino
            const vectorSource = new VectorSource({
                features: [
                    new Feature({
                        geometry: new Point(routeStartCoords),
                        style: createMarkerStyle('red'),
                    }),
                    new Feature({
                        geometry: new Point(routeEndCoords),
                        style: createMarkerStyle('blue'),
                    }),
                ],
            });

            const markerLayer = new VectorLayer({
                source: vectorSource,
            });

            map.addLayer(markerLayer);
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
                    </Layers>
                </Map>
            </div>
        </MapProvider>
    );
}

export default App;


