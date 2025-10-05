// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Map } from "react-map-gl/maplibre";
import { DeckGL } from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer, IconLayer, PolygonLayer } from "@deck.gl/layers";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
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
import { useModelData } from "../../contexts/ModelDataContext";

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
  modelData?: Array<DataPoint> | string;
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
  modelData: _data = DATA_URL,
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

  // Use ModelData context for monthIndex/depth and modelData
  const { modelData, monthIndex, setMonthIndex, depth, setDepth, updateVisibleCoords, fetchModelData } = useModelData();
  const START_YEAR = 2020;
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const TOTAL_MONTHS = 60;

  const { selectedView, colorblindMode } = usePalette();
  const activeView = selectedView ?? "default";
  // map display names to internal palette keys
  const VIEW_TO_KEY: Record<string, string> = {
    Temperature: "temperature",
    Clouds: "clouds",
    "Ocean Depth": "ocean depth",
    Phytoplanktons: "phytoplanktons",
    default: "default",
  };
  const activePaletteKey = VIEW_TO_KEY[activeView] ?? "default";
  const cbKey = `${activePaletteKey}_cb`;
  const activePalette = (colorblindMode && PALETTES[cbKey]) ? PALETTES[cbKey] : (PALETTES[activePaletteKey] || PALETTES.default);

  const points = useMemo(() => {
    if (!modelData || typeof modelData === "string") return [] as Array<{ position: number[]; weight: number }>;
    return (modelData as DataPoint[]).map((d) => ({ position: [d[0], d[1]], weight: d[2] }));
  }, [modelData]);

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
  const [iconImage, setIconImage] = useState<HTMLImageElement | null>(null);
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
      setIconImage(img);
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

  const handleZoomIn = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      zoom: Math.min((prev.zoom as number) + 1, 20),
      transitionDuration: 300,
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      zoom: Math.max((prev.zoom as number) - 1, 0),
      transitionDuration: 300,
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
        data: (modelData as DataPoint[]) || [],
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
        pickable: true,
        // use the loaded Image element when available, otherwise fall back to URL
        iconAtlas: (iconImage as any) || (flagStudentIcon as any),
        sizeUnits: 'pixels',
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

  // local ref to the underlying MapLibre map instance
  const [mapObj, setMapObj] = useState<any | null>(null);
  // lightweight ref to remember last sampled point count to avoid
  // emitting identical coords repeatedly
  const lastPtsCountRef = useRef<number | null>(null);

  const handleMapLoad = useCallback((e: any) => {
    // react-map-gl passes an event with target as the map instance
    const maybeMap = e?.target ?? e;
    setMapObj(maybeMap);
  }, []);

  // Use maplibre event-driven sampling instead of relying on viewState effects.
  // This runs when the user finishes interactions (moveend/zoomend) and is
  // debounced to avoid excessive sampling during continuous interactions.
  useEffect(() => {
    if (!mapObj) return;

    let mounted = true;
    let debounceId: any = null;
    let inFlight = false;
    const thresholdZoom = 2.6; // lower zoom threshold (≈ scale 6)

    const performSampleAndFetch = async () => {
      if (!mounted) return;
      try {
        const zoom = mapObj.getZoom?.() ?? (viewState?.zoom as number) ?? 0;
        console.log('[LatitudeMap] performSampleAndFetch - zoom:', zoom, 'thresholdZoom:', thresholdZoom);
        if (zoom < thresholdZoom) {
          updateVisibleCoords([]);
          return;
        }

        const scale = Math.pow(2, zoom);
        const canvas = mapObj.getCanvas && mapObj.getCanvas();
        const width = (canvas && (canvas.clientWidth || canvas.width)) || 800;
        const height = (canvas && (canvas.clientHeight || canvas.height)) || 600;
        const pixelStep = Math.max(8, Math.round(800 / scale));

        const pts: Array<[number, number]> = [];
        for (let y = 0; y < height; y += pixelStep) {
          for (let x = 0; x < width; x += pixelStep) {
            try {
              const ll = mapObj.unproject([x, y]);
              if (ll && typeof ll.lng === 'number' && typeof ll.lat === 'number') pts.push([ll.lng, ll.lat]);
            } catch {}
          }
        }

        if (!lastPtsCountRef.current || lastPtsCountRef.current !== pts.length) {
          updateVisibleCoords(pts);
          lastPtsCountRef.current = pts.length;
          console.log('[LatitudeMap] computed visible grid coords count:', pts.length, 'pixelStep:', pixelStep);

          if (inFlight) {
            console.log('[LatitudeMap] fetch in flight, skipping new fetch');
            return;
          }

          inFlight = true;
          try {
            const payload = {
              date: (() => {
                const year = START_YEAR + Math.floor(monthIndex / 12);
                const month = (monthIndex % 12) + 1;
                return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-01T00:00:00Z`;
              })(),
              depth,
              view: selectedView,
              coords: pts,
            };
            console.log('[LatitudeMap] sending classifier request body:', payload);
            const res = await fetchModelData({ year: START_YEAR + Math.floor(monthIndex / 12), month: (monthIndex % 12) + 1, depth, coords: pts });
            console.log('[LatitudeMap] classifier response:', res);
          } catch (err) {
            console.error('[LatitudeMap] classifier call failed:', err);
          } finally {
            inFlight = false;
          }
        }
      } catch (err) {
        console.error('Failed to compute visible grid coords:', err);
      }
    };

    const handler = () => {
      if (debounceId) clearTimeout(debounceId);
      debounceId = setTimeout(() => { void performSampleAndFetch(); }, 250);
    };

    try {
      mapObj.on?.('moveend', handler);
      mapObj.on?.('zoomend', handler);
    } catch (e) {
      // ignore if mapObj doesn't support event API
    }

    // run once to sample current view
    handler();

    return () => {
      mounted = false;
      if (debounceId) clearTimeout(debounceId);
      try { mapObj.off?.('moveend', handler); mapObj.off?.('zoomend', handler); } catch (e) {}
    };
  }, [mapObj, fetchModelData, monthIndex, depth, selectedView, updateVisibleCoords, viewState]);

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
        <Map reuseMaps mapStyle={mapStyle} mapLib={maplibregl as any} attributionControl={false} onLoad={handleMapLoad} />
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

      {/* Zoom controls */}
      <div className="absolute top-20 right-4 z-[1002] flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white/90 hover:bg-white text-black rounded border border-gray-300 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white/90 hover:bg-white text-black rounded border border-gray-300 flex items-center justify-center font-bold text-lg shadow-md transition-colors"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>

      {/* Remove the depth slider and time controls - commenting out the entire sections */}
      {/* 
      <div className="absolute bottom-[15%] rotate-[270deg] right-1 z-2003 flex items-center">
        ...depth slider removed...
      </div>
      
      <div className="absolute left-12 right-12 bottom-2 z-2002 px-3 py-0 rounded-2xl text-black bg-zinc-400/60">
        ...time controls removed...
      </div>
      */}
      
      <Dialog
        open={quizDialogOpen}
        onClose={() => setQuizDialogOpen(false)}
        title={activeQuestion?.questionText || "Question"}
        image={activeQuestion?.image}
        options={activeQuestion?.options}
        correctAnswer={activeQuestion?.answer}
        onAnswer={(isCorrect, selected) => {
          if (isCorrect) {
            setTimeout(() => setQuizDialogOpen(false), 900);
          }
          console.info("Answer selected:", selected, "correct:", isCorrect);
        }}
      />
    </div>
  );
}