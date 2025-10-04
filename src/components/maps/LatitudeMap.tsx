// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer, IconLayer, BitmapLayer } from "@deck.gl/layers";
import { useCallback, useMemo, useState, useEffect } from "react";
import { colorForValue, PALETTES } from "./utils/palettes";
import useMapTooltip from "./utils/useMapTooltip";
import { usePalette } from "../../contexts/PaletteContext";
import { FlyToInterpolator } from "@deck.gl/core";
import type { MapViewState } from "@deck.gl/core";
import MapBar from "./utils/mapBar";
import { mockQuizPoints, QuizPoint } from "../../data/mock/mockQuestionsData";
import { mockAerosol, ROWS as A_ROWS, COLS as A_COLS, BBOX as A_BBOX } from "../../data/mock/mockAerosol";
import flagIcon from "../../assets/flag_research.png";
import Dialog from "../ui/dialog";

const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json";

// wider, zoomed-out initial view so user sees more of the area
const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 1.2,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

type DataPoint = [longitude: number, latitude: number, count: number];

interface LatitudeMapProps {
  researchData?: Array<DataPoint> | string;
  intensity?: number;
  threshold?: number;
  radiusPixels?: number;
  mapStyle?: string;
  quizData?: Array<QuizPoint> | string;
  mapMode?: "research" | "student";
}

export default function MapLatitude({
  researchData: data = DATA_URL,
  intensity = 1,
  threshold = 0.03,
  radiusPixels = 30,
  mapStyle = MAP_STYLE,
  quizData = mockQuizPoints,
  mapMode: mapModeProp,
}: LatitudeMapProps) {
  const [viewState, setViewState] = useState<
    MapViewState & { transitionDuration?: number; transitionInterpolator?: any }
  >(INITIAL_VIEW_STATE);
  const [enabled, setEnabled] = useState(false);
  // mapMode is now passed in as a prop from the Sidebar (or parent)
  const effectiveMapMode = mapModeProp ?? "research";

  const { selectedView } = usePalette();
  const activeView = selectedView ?? "default";
  // map display names to internal palette keys
  const VIEW_TO_KEY: Record<string, string> = {
    Temperature: "temperature",
    Salinity: "salinity",
    "Ocean Topography": "topography",
    "Ocean Currents": "currents",
    Biomass: "biomass",
    default: "default",
  };
  const activePaletteKey = VIEW_TO_KEY[activeView] ?? "default";
  const activePalette = (PALETTES[activePaletteKey] || PALETTES.default) as number[][];

  const points = useMemo(() => {
    if (typeof data === "string")
      return [] as Array<{ position: number[]; weight: number }>;
    return (data as DataPoint[]).map((d) => ({
      position: [d[0], d[1]],
      weight: d[2],
    }));
  }, [data]);

  const { tooltip, makeHoverHandler, cursor } = useMapTooltip();

  // dialog state for quiz questions
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    questionText: string;
    options?: string[];
    answer?: string;
  } | null>(null);

  // dynamically build iconMapping from the imported flag image so IconLayer
  // will render correctly regardless of the image's actual pixel size.
  const [iconMapping, setIconMapping] = useState<any | null>(null);
  // simple RAF-driven pulse value in [0..1]
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const dur = 1200;
    const loop = (t: number) => {
      if (!start) start = t;
      const v = (Math.sin(((t - start) / dur) * Math.PI * 2) + 1) / 2;
      setPulse(v);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // generate the aerosol canvas from a mock 2D grid (mockAerosol)
  const aerosolCanvas = useMemo(() => {
    if (typeof window === "undefined") return null;
    const cols = A_COLS;
    const rows = A_ROWS;
    // canvas pixel resolution (one canvas pixel per data cell or scaled)
    const scale = 4; // upscale for smoother appearance
    const w = cols * scale;
    const h = rows * scale;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return c;

    const img = ctx.createImageData(w, h);
    for (let ry = 0; ry < rows; ry++) {
      for (let rx = 0; rx < cols; rx++) {
        const t = Math.max(0, Math.min(1, mockAerosol[ry]?.[rx] ?? 0));
  const [r, g, b] = colorForValue(activePalette, t);
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const x = rx * scale + sx;
            const y = ry * scale + sy;
            const idx = (y * w + x) * 4;
            img.data[idx + 0] = Math.round(r);
            img.data[idx + 1] = Math.round(g);
            img.data[idx + 2] = Math.round(b);
            img.data[idx + 3] = Math.round(200 * t);
          }
        }
      }
    }

    ctx.putImageData(img, 0, 0);
    return c;
  }, [selectedView]);
  useEffect(() => {
    if (!flagIcon) return;
    const img = new Image();
    img.onload = () => {
      const w = img.width || 64;
      const h = img.height || 64;
      setIconMapping({
        flag: {
          x: 0,
          y: 0,
          width: w,
          height: h,
          anchorY: h,
          anchorX: Math.floor(w / 2),
        },
      });
    };
    img.onerror = () => {
      // fallback mapping if load fails
      setIconMapping({
        flag: { x: 0, y: 0, width: 64, height: 64, anchorY: 64, anchorX: 32 },
      });
    };
    img.src = flagIcon as unknown as string;
  }, []);

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
      transitionInterpolator: new FlyToInterpolator(),
    }));
  }, []);

  const layers: any[] = [
    (() => {
      // Build colorRange expected by deck.gl HeatmapLayer: array of [r,g,b,a]
  const palette = activePalette;
      const heatColorRange = Array.isArray(palette)
        ? palette.map((c: number[]) => [c[0], c[1], c[2], 255])
        : [];
      return new HeatmapLayer<DataPoint>({
        data,
        id: "heatmap-layer",
        pickable: true,
        getPosition: (d) => [d[0], d[1]],
        getWeight: (d) => d[2],
        radiusPixels,
        intensity,
        threshold,
        // allow clicking on the heatmap to zoom to that location
        onClick: (info: any) => {
          if (!info || !info.coordinate || !Array.isArray(info.coordinate))
            return true;
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
            transitionInterpolator: new FlyToInterpolator(),
          }));
          return true;
        },
  // colorRange typing is strict; cast at runtime after validation
  colorRange: heatColorRange as unknown as any,
  // show quiz flags when enabled (student mode) — either MapBar enabled or explicit student mapMode
        onHover: makeHoverHandler((obj: any, info: any) => {
          const lon = info?.coordinate?.[0] ?? obj[0] ?? NaN;
          const lat = info?.coordinate?.[1] ?? obj[1] ?? NaN;
          return { weight: obj[2], lon, lat };
        }),
      });
    })(),
    new ScatterplotLayer<any>({
      id: "heat-dots",
      data: points,
      pickable: true,
      radiusUnits: "pixels",
      getPosition: (d) => d.position,
      getRadius: (_d: any) => 4,
      getFillColor: (d) => {
  const t = Math.max(0, Math.min(1, (d.weight || 0) / 10));
  const [r, g, b] = colorForValue(activePalette, t);
        return [r, g, b, 200];
      },
      onClick: onDotClick,
      onHover: makeHoverHandler((obj: any, info: any) => {
        const lon =
          (obj.position && obj.position[0]) ?? info?.coordinate?.[0] ?? NaN;
        const lat =
          (obj.position && obj.position[1]) ?? info?.coordinate?.[1] ?? NaN;
        return { weight: obj.weight, lon, lat };
      }),
    }),
  ];

  // If enabled, add aerosol BitmapLayer beneath the heatmap
  if (enabled && aerosolCanvas) {
    // geographic bounds: use the mock aerosol bbox
    layers.unshift(
      new BitmapLayer({
        id: "aerosol-raster",
        image: aerosolCanvas,
        // cast to any to avoid strict tuple typing issues
        bounds: (A_BBOX as any),
        opacity: 0.45,
        desaturate: 0.2,
        pickable: false,
      })
    );
  }

  // show quiz flags when enabled (student mode) — explicit student mapMode
  if (effectiveMapMode === "student") {
    const quizPointsData = (
      typeof quizData === "string" ? [] : (quizData as QuizPoint[])
    ).map((q) => ({ position: [q[0], q[1]], question: q[2] }));

    // halo beneath flags: non-pickable pulsing scatter layer
    layers.push(
      new ScatterplotLayer<any>({
        id: "quiz-halo",
        data: quizPointsData,
        pickable: false,
        getPosition: (d: any) => d.position,
        // halo size derived from icon base size and pulse, scaled by zoom
        getRadius: (_d: any) => {
          const width = (iconMapping?.flag?.width as number) ?? 64;
          const baseIcon = Math.max(16, Math.floor(width / 0.75));
          // make halo smaller: 0.6x of icon size, minimum 6px
          const baseHalo = Math.max(2, Math.floor(baseIcon * 0.2));
          // pulse independent of zoom
          const radius = Math.round(baseHalo * (1 + pulse * 0.12));
          return radius;
        },
        radiusUnits: "pixels",
        getFillColor: () => {
          // constant, small alpha so halo remains subtle
          return [255, 200, 0, 40];
        },
        opacity: 1,
      })
    );

    layers.push(
      new IconLayer<any>({
        id: "quiz-flags",
        data: quizPointsData,
        pickable: true,
        // use the single-image atlas
        iconAtlas: flagIcon as any,
        // use dynamic mapping when available
        iconMapping: iconMapping || { flag: { x: 0, y: 0, width: 64, height: 64, anchorY: 64, anchorX: 32 } },
        getIcon: (_d: any) => "flag",
        sizeScale: 1,
        getSize: (_d: any) => {
          // base size from image width, pulse independent of zoom
          const width = (iconMapping?.flag?.width as number) ?? 64;
          const base = Math.max(16, Math.floor(width / 0.75));
          // pulse between 0.85..1.15
          const mult = 0.85 + pulse * 0.3;
          return Math.round(base * mult);
        },
        getPosition: (d: any) => d.position,
        onClick: (info: any) => {
          const obj = info?.object;
          if (!obj) return;
          const lon = info.coordinate?.[0] ?? obj.position?.[0] ?? NaN;
          const lat = info.coordinate?.[1] ?? obj.position?.[1] ?? NaN;
          setViewState((prev) => ({
            ...prev,
            longitude: lon,
            latitude: lat,
            zoom: Math.max((prev.zoom as number) ?? 1, 6),
            transitionDuration: 500,
            transitionInterpolator: new FlyToInterpolator(),
          }));
          // open dialog with the question
          const q = obj.question;
          setActiveQuestion({ questionText: q.question, options: q.options, answer: q.answer });
          setQuizDialogOpen(true);
        },
      })
    );
    // We'll render pulsing DOM overlays (Tailwind animate-pulse) above the map
    // so we can animate using CSS and still keep IconLayer as the authoritative
    // map-layer for icons. quizPointsData will be used below to compute overlays.
  }

  

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
      <MapBar enabled={enabled} setEnabled={setEnabled} />

      <DeckGL
        style={{ zIndex: "0" }}
        viewState={viewState}
        controller={true}
        onViewStateChange={(e: any) => setViewState(e.viewState)}
        layers={layers}
      >
        <Map reuseMaps mapStyle={mapStyle} mapLib={maplibregl as any} />
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
            <strong>Intensity:</strong> {String(tooltip.weight)}
          </div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            <strong>Lon:</strong>{" "}
            {typeof tooltip.lon === "number" && Number.isFinite(tooltip.lon)
              ? (tooltip.lon as number).toFixed(4)
              : "n/a"}{" "}
            <strong>Lat:</strong>{" "}
            {typeof tooltip.lat === "number" && Number.isFinite(tooltip.lat)
              ? (tooltip.lat as number).toFixed(4)
              : "n/a"}
          </div>
        </div>
      )}
      
      
      <Dialog
        open={quizDialogOpen}
        onClose={() => setQuizDialogOpen(false)}
        title={activeQuestion?.questionText || "Question"}
        questionText={activeQuestion?.questionText}
        options={activeQuestion?.options}
        correctAnswer={activeQuestion?.answer}
        onAnswer={(isCorrect, selected) => {
          // simple feedback handling: close dialog after a short delay if correct
          if (isCorrect) {
            setTimeout(() => setQuizDialogOpen(false), 900);
          }
          // otherwise keep it open so user sees the red highlight
          console.info("Answer selected:", selected, "correct:", isCorrect);
        }}
      />
    </div>
  );
}