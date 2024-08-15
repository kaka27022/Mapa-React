import React from 'react';
import { MapProvider } from './Map/MapContext'; // Corrija o caminho se necessário
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

function App() {
    const center = fromLonLat([-43.5300, -20.3833]); // São Paulo, BR
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
          <WhiteRectangle>
              <StyledH1>Origem:</StyledH1>
              <InputField type="text" placeholder="Digite o local de origem" />

              <StyledH1>Destino:</StyledH1>
              <InputField type="text" placeholder="Digite o local de destino" />
          </WhiteRectangle>

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

