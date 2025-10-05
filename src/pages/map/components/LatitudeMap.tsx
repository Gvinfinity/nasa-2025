// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Map } from 'react-map-gl/maplibre';
import { DeckGL } from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { useCallback, useMemo, useState } from 'react';
import { colorForValue, VIEWS, PALETTES } from '../../../components/maps/utils/palettes';
import useMapTooltip from '../../../components/maps/utils/useMapTooltip';
import { usePalette } from '../../../contexts/PaletteContext';
import { FlyToInterpolator } from '@deck.gl/core';
import type { MapViewState } from '@deck.gl/core';

const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json';

// wider, zoomed-out initial view so user sees more of the area
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1.2,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

type DataPoint = [longitude: number, latitude: number, count: number];

interface LatitudeMapProps {
  data?: Array<DataPoint> | string;
  intensity?: number;
  threshold?: number;
  radiusPixels?: number;
  mapStyle?: string;
}

export default function MapLatitude({
  data = DATA_URL,
  intensity = 1,
  threshold = 0.03,
  radiusPixels = 30,
  mapStyle = MAP_STYLE
}: LatitudeMapProps) {

  const [viewState, setViewState] = useState<
    MapViewState & { transitionDuration?: number; transitionInterpolator?: any }>(INITIAL_VIEW_STATE);

  const { selectedView, setSelectedView, colorblindMode } = usePalette();

  const points = useMemo(() => {
    if (typeof data === 'string') return [] as Array<{ position: number[]; weight: number }>;
    return (data as DataPoint[]).map(d => ({ position: [d[0], d[1]], weight: d[2] }));
  }, [data]);

  const { tooltip, makeHoverHandler, cursor } = useMapTooltip();

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
      zoom: Math.max((prev.zoom as number) ?? 1, 8),
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator()
    }));
  }, []);

  // Determine palette key from the human-friendly selectedView and prefer colorblind variant if enabled.
  const VIEW_TO_KEY: Record<string, string> = {
    Temperature: "temperature",
    Salinity: "salinity",
    "Ocean Topography": "topography",
    "Ocean Currents": "currents",
    Biomass: "biomass",
    default: "default",
  };
  const paletteKey = VIEW_TO_KEY[selectedView ?? "default"] ?? "default";
  const cbKey = `${paletteKey}_cb`;
  const palette: number[][] = (colorblindMode && PALETTES[cbKey]) ? PALETTES[cbKey] : (PALETTES[paletteKey] || PALETTES.default);
  const heatColorRange = palette.map((c: number[]) => [c[0], c[1], c[2], 255]);

  const layers = [
    new HeatmapLayer<DataPoint>({
      data,
      id: 'heatmap-layer',
      pickable: true,
      getPosition: d => [d[0], d[1]],
      getWeight: d => d[2],
      radiusPixels,
      intensity,
      threshold,
      // allow clicking on the heatmap to zoom to that location
      onClick: (info: any) => {
        if (!info || !info.coordinate || !Array.isArray(info.coordinate)) return true;
        const coord = info.coordinate as number[];
        if (coord.length < 2) return true;
        const lon = coord[0];
        const lat = coord[1];
        setViewState((prev) => ({
          ...prev,
          longitude: lon,
          latitude: lat,
          zoom: Math.max((prev.zoom as number) ?? 1, 8),
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator()
        }));
        return true;
      },
      // colorRange typing is strict; cast at runtime after validation
      colorRange: (heatColorRange as unknown) as any,
      onHover: makeHoverHandler((obj: any, info: any) => {
        const lon = info?.coordinate?.[0] ?? obj[0] ?? NaN;
        const lat = info?.coordinate?.[1] ?? obj[1] ?? NaN;
        return { weight: obj[2], lon, lat };
      })
    }),
    new ScatterplotLayer<any>({
      id: 'heat-dots',
      data: points,
      pickable: true,
      radiusUnits: 'pixels',
      getPosition: d => d.position,
      getRadius: (_d: any) => 4,
      getFillColor: d => {
        const t = Math.max(0, Math.min(1, (d.weight || 0) / 10));
        const [r, g, b] = colorForValue(palette, t);
        return [r, g, b, 200];
      },
      onClick: onDotClick,
      onHover: makeHoverHandler((obj: any, info: any) => {
        const lon = (obj.position && obj.position[0]) ?? info?.coordinate?.[0] ?? NaN;
        const lat = (obj.position && obj.position[1]) ?? info?.coordinate?.[1] ?? NaN;
        return { weight: obj.weight, lon, lat };
      })
    })
  ];

  const cursorStyle = cursor;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', height: '100%', cursor: cursorStyle }}>
      <div style={{ position: 'absolute', left: 12, top: 12, zIndex: '1001', pointerEvents: 'auto' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.9)', padding: '6px 8px', borderRadius: 6 }}>
          <select value={selectedView} onChange={e => setSelectedView(e.target.value)}>
            {VIEWS.map((v: string) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
      </div>
      <DeckGL style={{ zIndex: '0' }} viewState={viewState} controller={true} onViewStateChange={(e: any) => setViewState(e.viewState)} layers={layers}>
        <Map reuseMaps mapStyle={mapStyle} mapLib={maplibregl as any} />
      </DeckGL>
      {tooltip && (
        <div style={{ position: 'absolute', left: (tooltip.x as number) + 12, top: (tooltip.y as number) + 12, background: 'rgba(0,0,0,0.75)', color: 'white', padding: '6px 8px', borderRadius: 4, pointerEvents: 'none', fontSize: 12 }}>
          <div><strong>Intensity:</strong> {String(tooltip.weight)}</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            <strong>Lon:</strong> {typeof tooltip.lon === 'number' && Number.isFinite(tooltip.lon) ? (tooltip.lon as number).toFixed(4) : 'n/a'}
            {' '}
            <strong>Lat:</strong> {typeof tooltip.lat === 'number' && Number.isFinite(tooltip.lat) ? (tooltip.lat as number).toFixed(4) : 'n/a'}
          </div>
        </div>
      )}
    </div>
  );
}
