import { DeckGL } from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useState } from "react";
import { FlyToInterpolator } from "@deck.gl/core";
import type { MapViewState } from "@deck.gl/core";
import {
  gridListToTuples,
  DataPoint,
  indexToRowCol,
  cellCenterLonLat,
} from "./utils/gridHelpers";
import useMapTooltip from "./utils/useMapTooltip";
import { colorForValue, VIEWS, PALETTES } from "./utils/palettes";
import { exampleGridList, ROWS, COLS, BBOX } from "../../mock/mockMapData";
import { usePalette } from "../../contexts/PaletteContext";

// start zoomed out so the user sees most of the planet initially
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1.2,
  pitch: 0,
  bearing: 0,
};

interface GridMapProps {
  gridList?: Array<[number, number]>;
  cols?: number;
  rows?: number;
  bbox?: [number, number, number, number];
}

export default function GridMap({
  gridList = exampleGridList,
  cols = COLS,
  rows = ROWS,
  bbox = BBOX,
}: GridMapProps) {
  const { selectedView, setSelectedView } = usePalette();
  const tuples: DataPoint[] = gridListToTuples(gridList, cols, rows, bbox);

  const [viewState, setViewState] = useState<
    MapViewState & { transitionDuration?: number; transitionInterpolator?: any }
  >(INITIAL_VIEW_STATE);

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
      transitionInterpolator: new FlyToInterpolator(),
    }));
  }, []);

  // Build scatter data preserving index and intensity so we can show them in tooltip
  const scatterData = exampleGridList.map(([index, intensity]) => {
    const { row, col } = indexToRowCol(index, COLS);
    const [lon, lat] = cellCenterLonLat(row, col, ROWS, COLS, BBOX);
    return { index, intensity, position: [lon, lat] };
  });

  const { tooltip, makeHoverHandler, cursor } = useMapTooltip();

  // Build colorRange for HeatmapLayer from selected palette with runtime validation
  const palette = PALETTES[selectedView] || PALETTES.default;
  const heatColorRange = Array.isArray(palette)
    ? palette.map((c) => [c[0], c[1], c[2], 255])
    : [];

  const layers = [
    new HeatmapLayer<DataPoint>({
      id: "grid-heat",
      data: tuples,
      getPosition: (d) => [d[0], d[1]],
      getWeight: (d) => d[2],
      radiusPixels: 30,
      intensity: 1,
      threshold: 0.03,
      // cast to any to satisfy deck.gl typings for colorRange
      colorRange: heatColorRange as any,
    }),

    new ScatterplotLayer<any>({
      id: "grid-dots",
      data: scatterData,
      pickable: true,
      radiusUnits: "pixels",
      getPosition: (d: any) => d.position,
      getRadius: () => 6,
      getFillColor: (d: any) => {
        // normalize intensity (adjust denominator as needed for your data)
        const t = Math.max(0, Math.min(1, (d.intensity || 0) / 10));
        const [r, g, b] = colorForValue(selectedView, t);
        return [r, g, b, 220];
      },
      onClick: onDotClick,
      onHover: makeHoverHandler((obj: any, info: any) => {
        // object from scatterData: { index, intensity, position }
        const lon =
          (obj.position && obj.position[0]) ?? info?.coordinate?.[0] ?? NaN;
        const lat =
          (obj.position && obj.position[1]) ?? info?.coordinate?.[1] ?? NaN;
        return { index: obj.index, intensity: obj.intensity, lon, lat };
      }),
    }),
  ];

  // Show pointer cursor when hovering a dot (tooltip present)
  const cursorStyle = cursor;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        height: "100%",
        cursor: cursorStyle,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          zIndex: "1001",
          pointerEvents: "auto",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.9)",
            padding: "6px 8px",
            borderRadius: 6,
          }}
        >
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            {VIEWS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      <DeckGL
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          zIndex: "0",
        }}
        viewState={viewState}
        controller={true}
        onViewStateChange={(e: any) => setViewState(e.viewState)}
        layers={layers}
      >
        <Map
          reuseMaps
          mapStyle={
            "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
          }
          mapLib={maplibregl as any}
        />
      </DeckGL>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: (tooltip.x as number) + 12,
            top: (tooltip.y as number) + 12,
            background: "rgba(0,0,0,0.75)",
            color: "white",
            padding: "6px 8px",
            borderRadius: 4,
            pointerEvents: "none",
            fontSize: 12,
          }}
        >
          <div>
            <strong>Index:</strong> {String(tooltip.index)}
          </div>
          <div>
            <strong>Intensity:</strong> {String(tooltip.intensity)}
          </div>
        </div>
      )}
    </div>
  );
}
