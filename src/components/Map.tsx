import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { Map } from "react-map-gl";

const data = [
  { position: [-43.2, -22.9], weight: 5 }, // Rio
  { position: [-80.1, 26.5], weight: 8 }, // Florida
  { position: [151.2, -33.8], weight: 3 }, // Sydney
];

const heatmapLayer = new HeatmapLayer({
  id: "shark-heatmap",
  data,
  getPosition: (d) => d.position,
  getWeight: (d) => d.weight,
  radiusPixels: 60,
  intensity: 1,
  threshold: 0.05,
  colorRange: [
    [0, 0, 255, 128], // Blue (low density)
    [0, 255, 0, 128], // Green
    [255, 255, 0, 128], // Yellow
    [255, 0, 0, 128], // Red (high density)
  ],
});

export default function SharkHeatmap() {
  return (
    <DeckGL
      initialViewState={{ longitude: 0, latitude: 0, zoom: 2 }}
      controller={true}
      layers={[heatmapLayer]}
    >
      <Map
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      />
    </DeckGL>
  );
}
