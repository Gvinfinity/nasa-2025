// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer, IconLayer, PolygonLayer } from "@deck.gl/layers";
import { useCallback, useMemo, useState, useEffect } from "react";
import { colorForValue, PALETTES } from "./utils/palettes";
import useMapTooltip from "./utils/useMapTooltip";
import { usePalette } from "../../contexts/PaletteContext";
import { FlyToInterpolator } from "@deck.gl/core";
import type { MapViewState } from "@deck.gl/core";
import MapBar from "./utils/mapBar";
import { mockQuizPoints, QuizPoint } from "../../data/mock/mockQuestionsData";
import { mockAerosol, ROWS as A_ROWS, COLS as A_COLS, BBOX as A_BBOX } from "../../data/mock/mockAerosol";
import flagStudentIcon from "../../assets/flag_student.png";
import Dialog from "../ui/dialog";
import { useResearchData } from "../../contexts/ResearchDataContext";

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

type DataPoint = [longitude: number, latitude: number, count: number, depth?: number];

interface LatitudeMapProps {
  researchData?: Array<DataPoint> | string;
  intensity?: number;
  threshold?: number;
  radiusPixels?: number;
  mapStyle?: string;
  quizData?: Array<QuizPoint> | string;
  mapMode?: "research" | "student";
  enabled?: boolean;
  setEnabled?: (b: boolean) => void;
}

export default function MapLatitude({
  researchData: _data = DATA_URL,
  intensity = 1,
  threshold = 0.03,
  radiusPixels = 30,
  mapStyle = MAP_STYLE,
  quizData = mockQuizPoints,
  mapMode: mapModeProp,
  enabled: enabledProp
}: LatitudeMapProps) {
  const [viewState, setViewState] = useState<
    MapViewState & { transitionDuration?: number; transitionInterpolator?: any }
  >(INITIAL_VIEW_STATE);
  const [localEnabled] = useState(false);
  const enabled = typeof enabledProp === "boolean" ? enabledProp : localEnabled;
  // mapMode is now passed in as a prop from the Sidebar (or parent)
  const effectiveMapMode = mapModeProp ?? "research";

  // Use ResearchData context for monthIndex/depth and researchData
  const { researchData, monthIndex, setMonthIndex, depth, setDepth } = useResearchData();
  const START_YEAR = 2020;
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const TOTAL_MONTHS = 60;
  // const selectedYear = START_YEAR + Math.floor(monthIndex / 12);
  // const selectedMonth = (monthIndex % 12) + 1; // 1..12

  const { selectedView, colorblindMode } = usePalette();
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
  const cbKey = `${activePaletteKey}_cb`;
  const activePalette = (colorblindMode && PALETTES[cbKey]) ? PALETTES[cbKey] : (PALETTES[activePaletteKey] || PALETTES.default);

  const points = useMemo(() => {
    if (!researchData || typeof researchData === "string") return [] as Array<{ position: number[]; weight: number }>;
    return (researchData as DataPoint[]).map((d) => ({ position: [d[0], d[1]], weight: d[2] }));
  }, [researchData]);

  // local, debounced slider state to avoid rapid provider fetches
  const [displayMonth, setDisplayMonth] = useState<number>(monthIndex);
  const [displayDepth, setDisplayDepth] = useState<number>(depth);

  // sync local display state when provider values change externally
  useEffect(() => setDisplayMonth(monthIndex), [monthIndex]);
  useEffect(() => setDisplayDepth(depth), [depth]);

  // debounce month -> setMonthIndex
  useEffect(() => {
    const t = setTimeout(() => {
      if (displayMonth !== monthIndex) setMonthIndex(displayMonth);
    }, 350);
    return () => clearTimeout(t);
  }, [displayMonth, monthIndex, setMonthIndex]);

  // debounce depth -> setDepth
  useEffect(() => {
    const t = setTimeout(() => {
      if (displayDepth !== depth) setDepth(displayDepth);
    }, 300);
    return () => clearTimeout(t);
  }, [displayDepth, depth, setDepth]);

  const { tooltip, makeHoverHandler, makeHoverHandlerSilent, cursor } = useMapTooltip();

  // dialog state for quiz questions
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    questionText: string;
    options?: string[];
    answer?: string;
    image?: string;
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
  // build polygon tiles from mockAerosol grid and color them using inverted palette colors
  const aerosolPolygons = useMemo(() => {
    if (typeof window === "undefined") return [] as any[];
    const cols = A_COLS;
    const rows = A_ROWS;
    const [minLon, minLat, maxLon, maxLat] = A_BBOX as any;
    const cellW = (maxLon - minLon) / cols;
    const cellH = (maxLat - minLat) / rows;
    const out: Array<{ polygon: number[][]; value: number }> = [];
    for (let ry = 0; ry < rows; ry++) {
      for (let rx = 0; rx < cols; rx++) {
        const t = Math.max(0, Math.min(1, mockAerosol[ry]?.[rx] ?? 0));
        const lon0 = minLon + rx * cellW;
        const lon1 = lon0 + cellW;
        // row 0 at top (maxLat)
        const lat1 = maxLat - ry * cellH;
        const lat0 = lat1 - cellH;
        const polygon = [
          [lon0, lat0],
          [lon1, lat0],
          [lon1, lat1],
          [lon0, lat1],
        ];
        out.push({ polygon, value: t });
      }
    }
    return out;
  }, [activePaletteKey]);
  useEffect(() => {
    if (!flagStudentIcon) return;
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
    img.src = flagStudentIcon as unknown as string;
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
        data: (researchData as DataPoint[]) || [],
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

  // If enabled, add aerosol PolygonLayer beneath the heatmap
  if (enabled && aerosolPolygons && aerosolPolygons.length) {
    layers.unshift(
      new PolygonLayer<any>({
        id: "aerosol-polygons",
        data: aerosolPolygons,
        pickable: false,
        stroked: true,
        filled: true,
        getPolygon: (d: any) => d.polygon,
        getFillColor: (d: any) => {
          const t = Math.max(0, Math.min(1, d.value || 0));
          const [r, g, b] = colorForValue(activePalette, t);
          // invert the color to get the 'opposite' color
          // use alpha=128 for ~50% transparency
          return [255 - Math.round(r), 255 - Math.round(g), 255 - Math.round(b), 100];
        },
        getLineColor: () => [0, 0, 0, 255],
        lineWidthMinPixels: 1,
      })
    );
  }

  // show quiz flags when enabled (student mode) — explicit student mapMode
  if (effectiveMapMode === "student") {
    const quizPointsData = (
      typeof quizData === "string" ? [] : (quizData as QuizPoint[])
    ).map((q) => ({ position: [q[0], q[1]], question: q[2] }));

    // halo beneath flags: make this the clickable/pickable pulsing area
    layers.push(
      new ScatterplotLayer<any>({
        id: "quiz-halo",
        data: quizPointsData,
        pickable: true,
        getPosition: (d: any) => d.position,
        // halo size derived from icon base size and pulse, scaled by zoom
        getRadius: (_d: any) => {
          const width = (iconMapping?.flag?.width as number) ?? 64;
          const baseIcon = Math.max(16, Math.floor(width / 0.75));
          // make halo larger than icon to be an easier target
          const baseHalo = Math.max(6, Math.floor(baseIcon * 0.4));
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
          const q = obj.question;
          console.log(q);
          setActiveQuestion({ questionText: q.question, options: q.options, answer: q.answer, image: q.image });
          setQuizDialogOpen(true);
        },
        // use the silent handler so the halo shows pointer cursor but does not create tooltip content
        onHover: makeHoverHandlerSilent(),
      })
    );

    layers.push(
      new IconLayer<any>({
        id: "quiz-flags",
        data: quizPointsData,
        pickable: false,
        // use the single-image atlas
        iconAtlas: flagStudentIcon as any,
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
  <MapBar />

      <DeckGL
        style={{ zIndex: "0" }}
        viewState={viewState}
        controller={true}
        onViewStateChange={(e: any) => setViewState(e.viewState)}
        layers={layers}
      >
        <Map reuseMaps mapStyle={mapStyle} mapLib={maplibregl as any} attributionControl={false} />
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

      {/* Vertical depth slider on the right */}
      <div className="absolute bottom-[15%] rotate-[270deg] right-1 z-2003 flex items-center">
        <div style={{ writingMode: 'vertical-rl',  color: 'white', fontSize: 11, opacity: 0.9 }}>{displayDepth} m</div>
        <input
          type="range"
          min={0}
          max={3000}
          step={10}
          value={displayDepth}
          onChange={(e) => setDisplayDepth(Number(e.target.value))}
          style={{ height: 140 }}
          aria-label="Depth (m)"
        />
      </div>
      
        <div  className="absolute left-12 right-12 bottom-2 z-2002 px-2 py-4 rounded-2xl bg-blue-900/60">
          <div className="flex items-center gap-12 ">
            <input
              type="range"
              min={0}
              max={TOTAL_MONTHS - 1}
              value={displayMonth}
              onChange={(e) => setDisplayMonth(Number(e.target.value))}
              style={{ flex: 1 }}
            />

          </div>

          {/* year labels above the slider + proportional month labels underneath */}
          <div style={{ position: 'relative', height: 36, marginTop: 6 }}>
            {/* Years (2020..2024) positioned proportionally above the slider */}
            <div style={{ position: 'absolute', left: 6, right: 6, top: -35, height: 18 }}>
              {Array.from({ length: 5 }).map((_, yi) => {
                const year = START_YEAR + yi;
                const pct = (yi / (5 - 1)) * 100; // 0..100 over five years
                return (
                  <div
                    key={year}
                    style={{
                      position: 'absolute',
                      left: `calc(${pct}% )`,
                      transform: 'translateX(-50%)',
                      top: 0,
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {year}
                  </div>
                );
              })}
            </div>

            {/* proportional month labels: positioned across the full monthIndex range */}
            <div style={{ position: 'absolute', left: 6, right: 6, top: 6, height: 24 }}>
              {Array.from({ length: 12 }).map((_, i) => {
                const pct = (i / (12 - 1)) * 100; // 0..100
                const monthIdx = Math.round((i / (12 - 1)) * (TOTAL_MONTHS - 1));
                const m = MONTHS[monthIdx % 12];
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `calc(${pct}% )`,
                      transform: 'translateX(-50%)',
                      top: 0,
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 12,
                    }}
                  >
                    {m}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      
      
      <Dialog
        open={quizDialogOpen}
        onClose={() => setQuizDialogOpen(false)}
        title={activeQuestion?.questionText || "Question"}
        image={activeQuestion?.image}
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