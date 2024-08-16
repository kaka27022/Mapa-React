import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Stroke } from 'ol/style';
import * as ol from 'ol';
import { fromLonLat } from 'ol/proj';

const API_KEY = "5b3ce3597851110001cf62486a00cc6718174196b9fd90272c03c213";

const fetchRoute = async (start: [number, number], end: [number, number]): Promise<[number, number][]> => {
    try {
        // Converta coordenadas para o formato correto (longitude, latitude)
        const startLonLat = `${start[0]},${start[1]}`;
        const endLonLat = `${end[0]},${end[1]}`;

        // Construa a URL para a requisição
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${startLonLat}&end=${endLonLat}`;

        // Adicione um log para verificar a URL da requisição
        console.log('URL da API:', url);

        // Realize a requisição para a API
        const response = await fetch(url);

        // Verifique se a resposta foi bem sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        // Obtenha os dados da resposta
        const data = await response.json();

        // Adicione um log para verificar a estrutura da resposta
        console.log('Resposta da API:', data);

        // Verifique se a resposta contém as rotas
        if (data.routes && data.routes.length > 0 && data.routes[0].geometry) {
            // Retorne as coordenadas da rota
            return data.routes[0].geometry.coordinates;
        } else {
            throw new Error('Nenhuma rota encontrada ou dados da rota malformados.');
        }
    } catch (error) {
        console.error('Erro ao buscar a rota:', error);
        throw error;
    }
};

// Atualize a função createRoute para lidar com a rota
const createRoute = async (map: ol.Map, start: [number, number], end: [number, number]) => {
    try {
        // Certifique-se de que as coordenadas estejam no formato correto (longitude, latitude)
        const coordinates = await fetchRoute(start, end);

        // Converta as coordenadas para o formato esperado pelo OpenLayers
        const routeCoordinates = coordinates.map((coord: [number, number]) => fromLonLat(coord));

        // Crie a fonte de dados da rota
        const routeSource = new VectorSource({
            features: [
                new Feature({
                    geometry: new LineString(routeCoordinates),
                }),
            ],
        });

        // Crie a camada da rota
        const routeLayer = new VectorLayer({
            source: routeSource,
            style: new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 3,
                }),
            }),
        });

        // Adicione a camada da rota ao mapa
        map.addLayer(routeLayer);
    } catch (error) {
        console.error('Erro ao criar a rota:', error);
    }
};

export default createRoute;