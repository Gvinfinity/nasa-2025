import { DeckGL } from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useState } from 'react';
import { FlyToInterpolator } from '@deck.gl/core';
import type { MapViewState } from '@deck.gl/core';

import { gridListToTuples, DataPoint, indexToRowCol, cellCenterLonLat } from './gridHelpers';
import { exampleGridList, ROWS, COLS, BBOX } from './mockGridData';

// start zoomed out so the user sees most of the planet initially
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1.2,
  pitch: 0,
  bearing: 0
};

export default function GridMap() {
  const tuples: DataPoint[] = gridListToTuples(exampleGridList, COLS, ROWS, BBOX);

  const [viewState, setViewState] = useState<MapViewState & { transitionDuration?: number; transitionInterpolator?: any }>(INITIAL_VIEW_STATE);

  const onDotClick = useCallback((info: any) => {
    if (!info || !info.coordinate || !Array.isArray(info.coordinate)) return;
    const coord = info.coordinate as number[];
    if (coord.length < 2) return;
    const lon = coord[0];
    const lat = coord[1];
    setViewState((prev) => ({
      ...prev,
      longitude: lon,
      latitude: lat,
      zoom: Math.max((prev.zoom as number) ?? 1, 6),
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator()
    }));
  }, []);

  // Build scatter data preserving index and intensity so we can show them in tooltip
  const scatterData = exampleGridList.map(([index, intensity]) => {
    const { row, col } = indexToRowCol(index, COLS);
    const [lon, lat] = cellCenterLonLat(row, col, ROWS, COLS, BBOX);
    return { index, intensity, position: [lon, lat] };
  });

  const [tooltip, setTooltip] = useState<null | { x: number; y: number; index: number; intensity: number }>(null);

  const layers = [
    new HeatmapLayer<DataPoint>({
      id: 'grid-heat',
      data: tuples,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2],
      radiusPixels: 30,
      intensity: 1,
      threshold: 0.03
    }),
    
    new ScatterplotLayer<any>({
      id: 'grid-dots',
      data: scatterData,
      pickable: true,
      radiusUnits: 'pixels',
      getPosition: (d: any) => d.position,
      getRadius: () => 6,
      getFillColor: (d: any) => [255, Math.min(255, d.intensity * 25), 0, 200],
      onClick: onDotClick,
      onHover: (info: any) => {
        if (info && info.object) {
          const obj = info.object as any;
          setTooltip({ x: info.x, y: info.y, index: obj.index, intensity: obj.intensity });
        } else {
          setTooltip(null);
        }
      }
    })
  ];

  // Show pointer cursor when hovering a dot (tooltip present)
  const cursorStyle = tooltip ? 'pointer' : 'default';

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', height: '100%', cursor: cursorStyle }}>
      
  <DeckGL style={{ position: 'absolute', top: '0', right: '0', bottom: '0', left: '0' }} viewState={viewState} controller={true} onViewStateChange={(e: any) => setViewState(e.viewState)} layers={layers}>
        <Map reuseMaps mapStyle={'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'} mapLib={maplibregl as any} />
      </DeckGL>
      {tooltip && (
        <div style={{ position: 'absolute', left: tooltip.x + 12, top: tooltip.y + 12, background: 'rgba(0,0,0,0.75)', color: 'white', padding: '6px 8px', borderRadius: 4, pointerEvents: 'none', fontSize: 12 }}>
          <div><strong>Index:</strong> {tooltip.index}</div>
          <div><strong>Intensity:</strong> {tooltip.intensity}</div>
        </div>
      )}
    </div>
  );
}
