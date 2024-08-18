import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Map from 'ol/Map';
import openrouteservice from 'openrouteservice-js'

const API_KEY = "5b3ce3597851110001cf62486a00cc6718174196b9fd90272c03c213";

const fetchRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
    try {
        const client = new openrouteservice.Directions({ api_key: API_KEY });

        const params = {
            coordinates: [
                [start[0], start[1]],
                [end[0], end[1]],
            ],
            profile: 'driving-car',
            format: 'geojson',
        };

        const response = await client.calculate(params);

        // Verifica se a resposta contém as rotas
        if (response.features && response.features.length > 0 && response.features[0].geometry) {
            // Retorna as coordenadas da rota
            return response.features[0].geometry.coordinates;
        } else {
            throw new Error('Nenhuma rota encontrada ou dados da rota malformados.');
        }
    } catch (error) {
        console.error('Erro ao buscar a rota:', error);
        throw error;
    }
};

const createRoute = async (map: Map, start: [number, number], end: [number, number]) => {
    try {
        // Certifica de que as coordenadas estejam no formato correto 
        const coordinates = await fetchRoute(start, end);

        // Converte as coordenadas para o formato esperado pelo OpenLayers
        const routeCoordinates = coordinates.map((coord: [number, number]) => fromLonLat(coord));

        // Cria a fonte de dados da rota
        const routeSource = new VectorSource({
            features: [
                new Feature({
                    geometry: new LineString(routeCoordinates),
                }),
            ],
        });

        // Cria a camada da rota
        const routeLayer = new VectorLayer({
            source: routeSource,
            style: new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 3,
                }),
            }),
        });

        // Adiciona a camada da rota ao mapa
        map.addLayer(routeLayer);
    } catch (error) {
        console.error('Erro ao criar a rota:', error);
    }
};

export default createRoute;
