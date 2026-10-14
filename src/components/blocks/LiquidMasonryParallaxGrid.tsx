"use client";

import {
  DEFAULT_ACCENT,
  DEFAULT_THEME,
  resolvedAccentHex,
  surfaceTokens,
} from "@/lib/theme";
import type { BlockProps } from "@/lib/theme";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  location: string;
  description: string;
  image: string;
  baseX: number;
  baseY: number;
  width: number;
  height: number;
  depth: number;
  featured: boolean;
};

const PHOTO: Record<string, string> = {
  "contemplative-solitude.webp":
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  "dynamic-basketball-action.webp":
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
  "dynamic-basketball-motion.webp":
    "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80",
  "joyful-backyard-scene.webp":
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  "minimalist-interior-design.webp":
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  "moth-in-flight.webp":
    "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1200&q=80",
  "rustic-charm-cafe.webp":
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
  "serene-beachcomber.webp":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "serene-grassland-portrait.webp":
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  "serene-pilates-studio.webp":
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  "silhouette-warm-glow.webp":
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
  "silhouetted-journey.webp":
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
  "tennis-victory-pose.webp":
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
  "urban-crosswalk-trio.webp":
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
  "urban-pose-fire-hydrant.webp":
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  "autumn-whisper-cafe.webp":
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80",
  "contemporary-rustic-grandeur.webp":
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  "cozy-cafe-scene.webp":
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  "minimalist-interior-ii.webp":
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  "modern-minimalist-house.webp":
    "https://images.unsplash.com/photo-1600596542813-4739d0b41b70?auto=format&fit=crop&w=1200&q=80",
  "modern-minimalist-house-ii.webp":
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80",
  "serene-countertop-scene.webp":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
  "tennis-action-shot.webp":
    "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?auto=format&fit=crop&w=1200&q=80",
  "traveler-in-terminal.webp":
    "https://images.unsplash.com/photo-1436491865332-7a61a164d4c4?auto=format&fit=crop&w=900&q=80",
  "warm-rustic-elegance.webp":
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80",
};

const IMG = (file: string) => PHOTO[file] ?? `/images/astra-archive/${file}`;

const WORLD_W = 5000;
const WORLD_H = 4000;
const CLAMP_X = 2400;
const CLAMP_Y = 1900;

const PROJECTS: Project[] = [
  {
    id: "p1", title: "Contemplative Solitude", category: "Portrait", year: "2025", location: "London, UK",
    description: "A quiet study in stillness — soft window light, muted tones, and the unhurried grace of being alone with your thoughts.",
    image: IMG("contemplative-solitude.webp"),
    baseX: -1800, baseY: -1100, width: 380, height: 475, depth: 0.8, featured: true,
  },
  {
    id: "p2", title: "Dynamic Basketball Action", category: "Sports", year: "2025", location: "Chicago, US",
    description: "Peak athleticism frozen mid-air — explosive vertical leap, tension in every muscle, and the raw energy of competition.",
    image: IMG("dynamic-basketball-action.webp"),
    baseX: -1100, baseY: -1500, width: 400, height: 571, depth: 0.9, featured: false,
  },
  {
    id: "p3", title: "Dynamic Basketball Motion", category: "Sports", year: "2024", location: "Los Angeles, US",
    description: "Motion blur meets precision — a kinetic portrait of speed, sweat, and the blur of bodies in constant movement on the court.",
    image: IMG("dynamic-basketball-motion.webp"),
    baseX: -400, baseY: -1000, width: 360, height: 540, depth: 1.1, featured: false,
  },
  {
    id: "p4", title: "Joyful Backyard Scene", category: "Lifestyle", year: "2025", location: "Austin, US",
    description: "Golden-hour warmth in a sun-dappled garden — candid laughter, natural light, and the easy joy of a summer afternoon at home.",
    image: IMG("joyful-backyard-scene.webp"),
    baseX: 400, baseY: -1400, width: 420, height: 525, depth: 0.7, featured: true,
  },
  {
    id: "p5", title: "Minimalist Interior", category: "Architecture", year: "2026", location: "Copenhagen, DK",
    description: "Restrained material palette and sculptural negative space — an interior where every line, shadow, and surface is intentional.",
    image: IMG("minimalist-interior-design.webp"),
    baseX: 1200, baseY: -1000, width: 280, height: 560, depth: 0.95, featured: false,
  },
  {
    id: "p6", title: "Moth in Flight", category: "Nature", year: "2024", location: "Kyoto, JP",
    description: "Macro intimacy with the ephemeral — delicate wing patterns caught against darkness, a fleeting creature in perfect focus.",
    image: IMG("moth-in-flight.webp"),
    baseX: 1800, baseY: -1600, width: 340, height: 510, depth: 1.15, featured: false,
  },
  {
    id: "p7", title: "Rustic Charm Café", category: "Editorial", year: "2023", location: "Lyon, FR",
    description: "Weathered wood, warm ceramics, and the slow ritual of morning coffee — an editorial love letter to European café culture.",
    image: IMG("rustic-charm-cafe.webp"),
    baseX: -2100, baseY: -300, width: 340, height: 600, depth: 0.85, featured: true,
  },
  {
    id: "p8", title: "Serene Beachcomber", category: "Fashion", year: "2025", location: "Nice, FR",
    description: "Avant-garde blue against coastal stillness — sculptural styling and ocean air in a dreamlike shoreline portrait series.",
    image: IMG("serene-beachcomber.webp"),
    baseX: -1300, baseY: -100, width: 380, height: 475, depth: 0.9, featured: false,
  },
  {
    id: "p9", title: "Grassland Portrait", category: "Photography", year: "2024", location: "Wellington, NZ",
    description: "Open sky and wind-swept grass frame a serene figure — landscape and portrait merge into one expansive, breathing composition.",
    image: IMG("serene-grassland-portrait.webp"),
    baseX: -500, baseY: -400, width: 520, height: 342, depth: 1.05, featured: false,
  },
  {
    id: "p10", title: "Pilates Studio", category: "Wellness", year: "2025", location: "Stockholm, SE",
    description: "Clean lines, soft natural light, and the calm discipline of movement — a sanctuary designed for focus and flow.",
    image: IMG("serene-pilates-studio.webp"),
    baseX: 300, baseY: -150, width: 360, height: 483, depth: 0.95, featured: false,
  },
  {
    id: "p11", title: "Silhouette in Warm Glow", category: "Fine Art", year: "2023", location: "Marrakech, MA",
    description: "A figure dissolved into amber light — high contrast, emotional weight, and the poetry of shape over detail.",
    image: IMG("silhouette-warm-glow.webp"),
    baseX: 1100, baseY: -600, width: 520, height: 294, depth: 0.75, featured: false,
  },
  {
    id: "p12", title: "Silhouetted Journey", category: "Travel", year: "2024", location: "Reykjavik, IS",
    description: "Horizon lines and a lone traveler — cinematic wide framing that turns a simple walk into an epic, quiet narrative.",
    image: IMG("silhouetted-journey.webp"),
    baseX: 1900, baseY: -200, width: 520, height: 291, depth: 1.1, featured: false,
  },
  {
    id: "p13", title: "Tennis Victory Pose", category: "Sports", year: "2025", location: "Melbourne, AU",
    description: "Triumph captured at the net — athletic poise, crisp whites, and the electric confidence of a match-point moment.",
    image: IMG("tennis-victory-pose.webp"),
    baseX: -1800, baseY: 600, width: 400, height: 500, depth: 0.85, featured: false,
  },
  {
    id: "p14", title: "Urban Crosswalk Trio", category: "Street", year: "2026", location: "New York, US",
    description: "Three strangers, one crossing, infinite stories — street photography at the intersection of pace, pattern, and city rhythm.",
    image: IMG("urban-crosswalk-trio.webp"),
    baseX: -900, baseY: 800, width: 380, height: 504, depth: 1.0, featured: true,
  },
  {
    id: "p15", title: "Urban Pose", category: "Fashion", year: "2025", location: "Brooklyn, US",
    description: "Bold styling against gritty sidewalk texture — fire-hydrant red, concrete grey, and attitude that owns the block.",
    image: IMG("urban-pose-fire-hydrant.webp"),
    baseX: -100, baseY: 600, width: 360, height: 540, depth: 0.65, featured: false,
  },
  {
    id: "p16", title: "Autumn Whisper Café", category: "Editorial", year: "2024", location: "Portland, US",
    description: "Fall foliage filters through café windows — copper tones, steam rising from cups, and the hush of a rainy afternoon.",
    image: IMG("autumn-whisper-cafe.webp"),
    baseX: 550, baseY: 1050, width: 400, height: 400, depth: 1.2, featured: false,
  },
  {
    id: "p17", title: "Rustic Grandeur", category: "Architecture", year: "2025", location: "Tuscany, IT",
    description: "Timber beams and stone walls in dramatic scale — contemporary living rooted in centuries of craft and material honesty.",
    image: IMG("contemporary-rustic-grandeur.webp"),
    baseX: 1900, baseY: 250, width: 360, height: 540, depth: 0.9, featured: false,
  },
  {
    id: "p18", title: "Cozy Café Scene", category: "Lifestyle", year: "2023", location: "Brussels, BE",
    description: "Intimate corners, warm lamplight, and the gentle hum of conversation — a portrait of everyday European comfort.",
    image: IMG("cozy-cafe-scene.webp"),
    baseX: -1400, baseY: 1500, width: 380, height: 504, depth: 1.05, featured: false,
  },
  {
    id: "p19", title: "Interior Study II", category: "Architecture", year: "2026", location: "Oslo, NO",
    description: "A second volume in the minimalist interior series — pale volumes, precise shadows, and silence made spatial.",
    image: IMG("minimalist-interior-ii.webp"),
    baseX: -300, baseY: 1400, width: 380, height: 504, depth: 0.8, featured: false,
  },
  {
    id: "p20", title: "Minimalist House", category: "Architecture", year: "2025", location: "Palm Springs, US",
    description: "Clean geometry meets desert light — flat planes, expansive glass, and architecture that disappears into the landscape.",
    image: IMG("modern-minimalist-house.webp"),
    baseX: 700, baseY: 1800, width: 360, height: 484, depth: 0.95, featured: true,
  },
  {
    id: "p21", title: "Desert Residence", category: "Architecture", year: "2024", location: "Joshua Tree, US",
    description: "Horizontal lines and sun-bleached surfaces — a modern retreat framed by arid hills and endless blue sky.",
    image: IMG("modern-minimalist-house-ii.webp"),
    baseX: 1700, baseY: 1600, width: 520, height: 347, depth: 0.85, featured: false,
  },
  {
    id: "p22", title: "Countertop Still Life", category: "Editorial", year: "2025", location: "Copenhagen, DK",
    description: "Marble, ceramic, and morning light arranged with editorial precision — the quiet beauty of a kitchen at dawn.",
    image: IMG("serene-countertop-scene.webp"),
    baseX: 2300, baseY: 1100, width: 380, height: 460, depth: 1.0, featured: false,
  },
  {
    id: "p23", title: "Tennis Action Shot", category: "Sports", year: "2024", location: "Paris, FR",
    description: "Mid-rally intensity on clay — split-second timing, stretched reach, and the athletic poetry of a forehand drive.",
    image: IMG("tennis-action-shot.webp"),
    baseX: -2000, baseY: 1200, width: 380, height: 504, depth: 0.75, featured: false,
  },
  {
    id: "p24", title: "Terminal Wanderer", category: "Travel", year: "2025", location: "Singapore, SG",
    description: "A lone figure in transit — fluorescent corridors, rolling luggage, and the liminal calm of airports between destinations.",
    image: IMG("traveler-in-terminal.webp"),
    baseX: 250, baseY: 1500, width: 300, height: 550, depth: 1.1, featured: false,
  },
  {
    id: "p25", title: "Rustic Elegance", category: "Interior", year: "2023", location: "Provence, FR",
    description: "Worn textures and refined details in harmony — linen drapes, aged wood, and the warmth of a countryside estate.",
    image: IMG("warm-rustic-elegance.webp"),
    baseX: 950, baseY: 1750, width: 520, height: 343, depth: 0.7, featured: false,
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];

const PROJECTS_BY_DISTANCE = [...PROJECTS].sort(
  (a, b) => Math.hypot(a.baseX, a.baseY) - Math.hypot(b.baseX, b.baseY),
);
const REVEAL_INDEX_BY_ID = Object.fromEntries(
  PROJECTS_BY_DISTANCE.map((p, i) => [p.id, i]),
) as Record<string, number>;

const MIN_ZOOM = 0.18;
const INTRO_START_ZOOM = 0.22;
const INTRO_END_ZOOM = 0.8;
const INTRO_ZOOM_DELAY_MS = 120;
const INTRO_ZOOM_MS = 5200;
const TILE_REVEAL_DURATION_MS = 650;
const TILE_REVEAL_STAGGER_MS = 130;
const MAGNET_PULL = 0.28;
const PRELOAD_CONCURRENCY = 12;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.length === 3 ? cleanHex[0] + cleanHex[0] : cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.length === 3 ? cleanHex[1] + cleanHex[1] : cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.length === 3 ? cleanHex[2] + cleanHex[2] : cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function LiquidMasonryParallaxGrid({
  theme = DEFAULT_THEME,
  accent = DEFAULT_ACCENT,
  embedded = false,
}: BlockProps) {
  const t = surfaceTokens(theme);
  const ac = resolvedAccentHex(accent, theme);
  const isDark = t.bg.toLowerCase() === "#1c1c1c" || t.bg.toLowerCase() === "#000000";

  const [isDraggingState, setIsDraggingState] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [zoomLevel, setZoomLevel] = useState(INTRO_START_ZOOM);
  const [introComplete, setIntroComplete] = useState(false);
  const [category, setCategory] = useState("All");
  const loadedIdsRef = useRef<Set<string>>(new Set());
  const categoryRef = useRef("All");

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const minimapViewportRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tileVisualRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tileRevealStartByIdRef = useRef<Map<string, number>>(new Map());
  const introCompleteFlagRef = useRef(false);

  const offsetRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(INTRO_START_ZOOM);
  const targetScaleRef = useRef(INTRO_START_ZOOM);
  const introStartRef = useRef<number | null>(null);
  const introDoneRef = useRef(false);
  const lastZoomUiRef = useRef(INTRO_START_ZOOM);
  const velocityRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0, startX: 0, startY: 0, isDown: false });
  const activePointerIdRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const containerSizeRef = useRef({ w: 1000, h: 800 });
  const prefersReducedMotionRef = useRef(false);

  const glassBgAlpha = isDark ? 0.3 : 0.6;
  const glassBorderAlpha = isDark ? 0.2 : 0.1;
  const glassStyle: CSSProperties = {
    backgroundColor: hexToRgba(t.surface, glassBgAlpha),
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    border: `1px solid ${hexToRgba(t.text, glassBorderAlpha)}`,
    boxShadow: `0 8px 32px 0 rgba(0, 0, 0, ${isDark ? 0.4 : 0.05}), inset 0 1px 0 0 ${hexToRgba("#ffffff", isDark ? 0.1 : 0.4)}`,
  };

  const visibleCount = category === "All"
    ? PROJECTS.length
    : PROJECTS.filter((p) => p.category === category).length;

  const markImageLoaded = (id: string) => {
    loadedIdsRef.current.add(id);
  };

  const applyCategory = (next: string) => {
    categoryRef.current = next;
    setCategory(next);
  };

  useEffect(() => {
    let cancelled = false;
    const queue = [...PROJECTS_BY_DISTANCE];

    const loadOne = (project: Project) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          if (!cancelled) markImageLoaded(project.id);
          resolve();
        };
        img.onload = done;
        img.onerror = done;
        img.src = project.image;
        if (img.complete) done();
      });

    const runPool = async () => {
      const workers = Array.from({ length: PRELOAD_CONCURRENCY }, async () => {
        while (queue.length > 0) {
          const project = queue.shift();
          if (!project || cancelled) return;
          await loadOne(project);
        }
      });
      await Promise.all(workers);
    };

    void runPool();

    return () => {
      cancelled = true;
    };
  }, []);

  const getTileRevealProgress = (projectId: string, now: number) => {
    if (prefersReducedMotionRef.current) return 1;
    const start = tileRevealStartByIdRef.current.get(projectId);
    if (start === undefined) return 0;
    if (now < start) return 0;
    const raw = Math.min(1, (now - start) / TILE_REVEAL_DURATION_MS);
    return easeOutCubic(raw);
  };

  const pauseIntroZoom = () => {
    if (introStartRef.current === null) return;
    introStartRef.current = null;
    introDoneRef.current = true;
    lastZoomUiRef.current = scaleRef.current;
    setZoomLevel(scaleRef.current);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    prefersReducedMotionRef.current = reduceMotion;

    if (reduceMotion) {
      scaleRef.current = INTRO_END_ZOOM;
      targetScaleRef.current = INTRO_END_ZOOM;
      setZoomLevel(INTRO_END_ZOOM);
      introDoneRef.current = true;
      introCompleteFlagRef.current = true;
      setIntroComplete(true);
      loadedIdsRef.current = new Set(PROJECTS.map((p) => p.id));
      return;
    }

    const now = performance.now();
    scaleRef.current = INTRO_START_ZOOM;
    targetScaleRef.current = INTRO_START_ZOOM;
    setZoomLevel(INTRO_START_ZOOM);
    introStartRef.current = now;
    introDoneRef.current = false;
    introCompleteFlagRef.current = false;
    setIntroComplete(false);

    const starts = new Map<string, number>();
    PROJECTS_BY_DISTANCE.forEach((project, i) => {
      starts.set(project.id, now + i * TILE_REVEAL_STAGGER_MS);
    });
    tileRevealStartByIdRef.current = starts;
  }, []);

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerSizeRef.current = {
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        };
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    const updateFrame = () => {
      const reduceMotion = prefersReducedMotionRef.current;

      if (!pointerRef.current.isDown) {
        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.92;
        targetOffsetRef.current.x += velocityRef.current.x;
        targetOffsetRef.current.y += velocityRef.current.y;
      }

      if (targetOffsetRef.current.x > CLAMP_X) targetOffsetRef.current.x += (CLAMP_X - targetOffsetRef.current.x) * 0.15;
      if (targetOffsetRef.current.x < -CLAMP_X) targetOffsetRef.current.x += (-CLAMP_X - targetOffsetRef.current.x) * 0.15;
      if (targetOffsetRef.current.y > CLAMP_Y) targetOffsetRef.current.y += (CLAMP_Y - targetOffsetRef.current.y) * 0.15;
      if (targetOffsetRef.current.y < -CLAMP_Y) targetOffsetRef.current.y += (-CLAMP_Y - targetOffsetRef.current.y) * 0.15;

      if (introStartRef.current !== null) {
        const elapsed = performance.now() - introStartRef.current;
        let introScale = INTRO_START_ZOOM;

        if (elapsed > INTRO_ZOOM_DELAY_MS) {
          const zoomElapsed = elapsed - INTRO_ZOOM_DELAY_MS;
          const progress = Math.min(1, zoomElapsed / INTRO_ZOOM_MS);
          const eased = 1 - Math.pow(1 - progress, 4);
          introScale = INTRO_START_ZOOM + (INTRO_END_ZOOM - INTRO_START_ZOOM) * eased;
        }

        scaleRef.current = introScale;
        targetScaleRef.current = introScale;

        if (elapsed >= INTRO_ZOOM_DELAY_MS + INTRO_ZOOM_MS) {
          introStartRef.current = null;
          introDoneRef.current = true;
          scaleRef.current = INTRO_END_ZOOM;
          targetScaleRef.current = INTRO_END_ZOOM;
          introScale = INTRO_END_ZOOM;
        }

        if (Math.abs(introScale - lastZoomUiRef.current) > 0.004) {
          lastZoomUiRef.current = introScale;
          setZoomLevel(introScale);
        }
      } else if (reduceMotion) {
        offsetRef.current.x = targetOffsetRef.current.x;
        offsetRef.current.y = targetOffsetRef.current.y;
        scaleRef.current = targetScaleRef.current;
      } else {
        offsetRef.current.x += (targetOffsetRef.current.x - offsetRef.current.x) * 0.25;
        offsetRef.current.y += (targetOffsetRef.current.y - offsetRef.current.y) * 0.25;
        scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.2;
      }

      const { x, y } = offsetRef.current;
      const scale = scaleRef.current;

      if (canvasRef.current) canvasRef.current.style.transform = `scale(${scale})`;
      if (gridRef.current) gridRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const vW_world = containerSizeRef.current.w / scale;
      const vH_world = containerSizeRef.current.h / scale;
      const viewMinX = -x - vW_world / 2;
      const viewMaxX = -x + vW_world / 2;
      const viewMinY = -y - vH_world / 2;
      const viewMaxY = -y + vH_world / 2;

      const now = performance.now();
      let allTilesSettled = true;
      const activeCategory = categoryRef.current;

      PROJECTS.forEach((p, idx) => {
        const reveal = getTileRevealProgress(p.id, now);
        if (reveal < 1) allTilesSettled = false;
        const matches = activeCategory === "All" || p.category === activeCategory;

        const el = itemRefs.current[idx];
        if (el) {
          const depth = reduceMotion ? 1 : p.depth;
          const dist = Math.hypot(p.baseX, p.baseY);
          const pull = MAGNET_PULL * Math.min(1, dist / 1600);
          const magnet = 1 - pull * (1 - reveal);
          const posX = p.baseX * magnet;
          const posY = p.baseY * magnet;
          const px = posX + x * depth;
          const py = posY + y * depth;
          el.style.transform = `translate3d(calc(-50% + ${px}px), calc(-50% + ${py}px), 0)`;
          el.style.zIndex = String(Math.round((p.depth + (1 - reveal) * 0.5) * 100));
          el.style.pointerEvents = matches ? "auto" : "none";
        }

        const visEl = tileVisualRefs.current[idx];
        if (visEl) {
          const opacity = !matches ? 0 : reveal <= 0 ? 0 : Math.min(1, reveal * 1.2);
          const blur = (1 - reveal) * 18;
          const tileScale = 0.92 + 0.08 * reveal;
          visEl.style.opacity = String(opacity);
          visEl.style.filter = `blur(${blur}px)`;
          visEl.style.transform = `scale(${tileScale})`;
        }

        const dotEl = dotRefs.current[idx];
        if (dotEl) {
          const isVisible = (
            matches &&
            p.baseX + p.width / 2 > viewMinX - 200 &&
            p.baseX - p.width / 2 < viewMaxX + 200 &&
            p.baseY + p.height / 2 > viewMinY - 200 &&
            p.baseY - p.height / 2 < viewMaxY + 200
          );

          if (!matches) {
            dotEl.style.opacity = "0.08";
            dotEl.style.transform = "scale(1)";
            dotEl.style.backgroundColor = t.text;
            dotEl.style.zIndex = "1";
          } else if (isVisible) {
            dotEl.style.opacity = "1";
            dotEl.style.transform = "scale(1.5)";
            dotEl.style.backgroundColor = ac;
            dotEl.style.zIndex = "10";
          } else {
            dotEl.style.opacity = "0.2";
            dotEl.style.transform = "scale(1)";
            dotEl.style.backgroundColor = t.text;
            dotEl.style.zIndex = "1";
          }
        }
      });

      if (allTilesSettled && introDoneRef.current && !introCompleteFlagRef.current) {
        introCompleteFlagRef.current = true;
        setIntroComplete(true);
      }

      if (minimapViewportRef.current) {
        const mmW = 200;
        const mmH = 160;
        const wScaleX = mmW / WORLD_W;
        const wScaleY = mmH / WORLD_H;

        const mapVW = (containerSizeRef.current.w / scale) * wScaleX;
        const mapVH = (containerSizeRef.current.h / scale) * wScaleY;

        const mapCX = (-x + WORLD_W / 2) * wScaleX;
        const mapCY = (-y + WORLD_H / 2) * wScaleY;

        minimapViewportRef.current.style.width = `${mapVW}px`;
        minimapViewportRef.current.style.height = `${mapVH}px`;
        minimapViewportRef.current.style.transform = `translate3d(${mapCX - mapVW / 2}px, ${mapCY - mapVH / 2}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(updateFrame);
    };

    rafRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [t.text, ac]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest(".interactive-panel")) return;
      if (embedded) return;
      e.preventDefault();
      const zoomSensitivity = 0.0015;
      targetScaleRef.current -= e.deltaY * zoomSensitivity;
      if (introStartRef.current !== null) {
        introStartRef.current = null;
        introDoneRef.current = true;
      }
      targetScaleRef.current = Math.max(MIN_ZOOM, Math.min(1.5, targetScaleRef.current));
      setZoomLevel(targetScaleRef.current);
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [embedded]);

  const releasePointerCapture = () => {
    if (containerRef.current && activePointerIdRef.current !== null) {
      try {
        containerRef.current.releasePointerCapture(activePointerIdRef.current);
      } catch {
        // Pointer may already be released.
      }
      activePointerIdRef.current = null;
    }
    pointerRef.current.isDown = false;
    setIsDraggingState(false);
  };

  const closeProject = () => {
    releasePointerCapture();
    setSelectedProject(null);
  };

  const handleProjectPointerDown = (
    e: ReactPointerEvent<HTMLButtonElement>,
    project: Project,
  ) => {
    e.stopPropagation();
    pointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      isDown: false,
    };
    const onPointerUp = (upEvent: PointerEvent) => {
      const dx = Math.abs(upEvent.clientX - pointerRef.current.startX);
      const dy = Math.abs(upEvent.clientY - pointerRef.current.startY);
      if (dx < 10 && dy < 10) {
        setSelectedProject(project);
      }
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  const handlePointerDown = (e: ReactPointerEvent) => {
    if ((e.target as HTMLElement).closest(".interactive-panel")) return;
    if ((e.target as HTMLElement).closest("[data-project-tile]")) return;

    pauseIntroZoom();

    pointerRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      isDown: true,
    };
    velocityRef.current = { x: 0, y: 0 };
    setIsDraggingState(true);

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
      activePointerIdRef.current = e.pointerId;
    }
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!pointerRef.current.isDown) return;

    const dx = e.clientX - pointerRef.current.x;
    const dy = e.clientY - pointerRef.current.y;

    const scaledDx = dx / scaleRef.current;
    const scaledDy = dy / scaleRef.current;

    targetOffsetRef.current.x += scaledDx;
    targetOffsetRef.current.y += scaledDy;
    velocityRef.current = { x: scaledDx, y: scaledDy };

    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;
  };

  const handlePointerUp = () => {
    releasePointerCapture();
  };

  const resetArchive = () => {
    targetOffsetRef.current = { x: 0, y: 0 };
    targetScaleRef.current = INTRO_END_ZOOM;
    scaleRef.current = INTRO_END_ZOOM;
    setZoomLevel(INTRO_END_ZOOM);
    applyCategory("All");
    closeProject();
  };

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedProject]);

  const adjustZoom = (delta: number) => {
    pauseIntroZoom();
    targetScaleRef.current = Math.max(MIN_ZOOM, Math.min(1.5, targetScaleRef.current + delta));
    setZoomLevel(targetScaleRef.current);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none outline-none font-sans touch-none ${
        embedded ? "h-[800px] max-h-[90vh]" : "min-h-screen"
      }`}
      style={{ backgroundColor: embedded ? "transparent" : t.bg, color: t.text }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="absolute top-1/2 left-1/2 w-[10000px] h-[10000px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <div
          ref={gridRef}
          className="w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, ${t.borderStrong} 1px, transparent 1px), linear-gradient(to bottom, ${t.borderStrong} 1px, transparent 1px)`,
            backgroundSize: "120px 120px",
            willChange: "transform",
          }}
        />
      </div>

      <div className="absolute inset-0 z-10 origin-center pointer-events-none">
        <div ref={canvasRef} className="absolute inset-0 origin-center will-change-transform">
          <div className="absolute top-1/2 left-1/2">
            {PROJECTS.map((project, idx) => (
              <button
                key={project.id}
                type="button"
                data-project-tile
                ref={(el) => { itemRefs.current[idx] = el; }}
                onPointerDown={(e) => handleProjectPointerDown(e, project)}
                className="absolute group transition-[filter,box-shadow] duration-300 ease-out flex flex-col focus:outline-none pointer-events-auto will-change-transform"
                style={{
                  width: project.width,
                  height: project.height,
                  zIndex: Math.round(project.depth * 100),
                  cursor: isDraggingState ? "grabbing" : "pointer",
                }}
                aria-label={`View project: ${project.title}`}
              >
                <div
                  ref={(el) => { tileVisualRefs.current[idx] = el; }}
                  className="w-full h-full will-change-[opacity,filter,transform]"
                  style={{ opacity: 0, filter: "blur(22px)", transform: "scale(0.86)" }}
                >
                  <div
                    className={`w-full h-full rounded-md shadow-2xl overflow-hidden relative bg-neutral-900 transition-[transform,box-shadow] duration-300
                      ${introComplete && !isDraggingState ? "group-hover:scale-[1.03] group-hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)]" : ""}
                      group-focus-visible:ring-2 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-transparent`}
                    style={{
                      boxShadow: project.featured
                        ? `0 0 0 1px ${hexToRgba(ac, 0.55)}, 0 0 28px ${hexToRgba(ac, 0.22)}, 0 30px 60px -20px rgba(0,0,0,0.5)`
                        : undefined,
                      outlineColor: ac,
                    }}
                  >
                    <img
                      src={project.image}
                      alt=""
                      draggable={false}
                      loading="eager"
                      decoding="async"
                      fetchPriority={(REVEAL_INDEX_BY_ID[project.id] ?? 99) < 10 ? "high" : "auto"}
                      onLoad={() => markImageLoaded(project.id)}
                      onError={() => markImageLoaded(project.id)}
                      ref={(el) => {
                        if (el?.complete && el.naturalWidth > 0) markImageLoaded(project.id);
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ imageRendering: "auto" }}
                    />
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-2.5 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm" style={{ ...glassStyle, color: t.text }}>
                        Featured
                      </div>
                    )}
                  </div>
                </div>

                <div className={`absolute top-[calc(100%+16px)] left-0 flex flex-col items-start transition-opacity duration-300 pointer-events-none whitespace-nowrap
                  ${!introComplete || isDraggingState ? "opacity-0" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}
                `}>
                  <p className="font-medium text-[16px] drop-shadow-md tracking-tight text-left" style={{ color: t.text }}>{project.title}</p>
                  <p className="text-[13px] opacity-70 drop-shadow-md mt-1 font-medium text-left" style={{ color: t.textSecondary }}>{project.category} &middot; {project.year}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-40 pointer-events-none p-4 md:p-8 flex flex-col justify-between interactive-panel">
        <div className="flex justify-between items-start pointer-events-auto gap-4">
          <div className="flex flex-col gap-3 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-4 py-2.5 rounded-full inline-flex items-center gap-2.5 shadow-sm" style={glassStyle}>
                <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: ac }} />
                <span className="font-semibold tracking-tight text-[13px]">Astra Archive</span>
              </div>
              <div className="px-3 py-2 rounded-full text-[12px] font-medium shadow-sm" style={glassStyle}>
                {visibleCount} {visibleCount === 1 ? "project" : "projects"}
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-widest pl-2 opacity-60" style={{ color: t.textSecondary }}>
              Spatial Index
            </span>
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto max-w-[min(720px,70vw)]">
              {CATEGORIES.map((chip) => {
                const active = category === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => applyCategory(chip)}
                    className="px-3 h-8 rounded-full text-[11px] font-medium whitespace-nowrap transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2"
                    style={{
                      ...glassStyle,
                      outlineColor: ac,
                      backgroundColor: active ? ac : glassStyle.backgroundColor,
                      color: active ? "#ffffff" : t.text,
                      border: active ? `1px solid ${ac}` : glassStyle.border,
                    }}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end shrink-0">
            <button
              type="button"
              onClick={resetArchive}
              className="px-4 h-10 rounded-full flex items-center justify-center gap-2 text-[13px] font-medium transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 shadow-sm"
              style={{ ...glassStyle, outlineColor: ac }}
              aria-label="Reset Archive"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset view
            </button>

            <div className="flex flex-col rounded-full overflow-hidden shadow-sm mt-2" style={glassStyle}>
              <button
                type="button"
                onClick={() => adjustZoom(0.15)}
                className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 z-10"
                style={{ outlineColor: ac, opacity: zoomLevel >= 1.5 ? 0.3 : 1 }}
                disabled={zoomLevel >= 1.5}
                aria-label="Zoom In"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <div className="h-px w-full bg-current opacity-10" />
              <button
                type="button"
                onClick={() => adjustZoom(-0.15)}
                className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2 z-10"
                style={{ outlineColor: ac, opacity: zoomLevel <= MIN_ZOOM ? 0.3 : 1 }}
                disabled={zoomLevel <= MIN_ZOOM}
                aria-label="Zoom Out"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-end pointer-events-auto">
          <div className="w-[200px] h-[160px] rounded-xl relative overflow-hidden shadow-lg" style={glassStyle}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, ${t.borderStrong} 1px, transparent 1px), linear-gradient(to bottom, ${t.borderStrong} 1px, transparent 1px)`, backgroundSize: "25px 25px" }} />

            {PROJECTS.map((p, idx) => (
              <div
                key={`mini-${p.id}`}
                ref={(el) => { dotRefs.current[idx] = el; }}
                className="absolute w-1.5 h-1.5 rounded-full -ml-[3px] -mt-[3px] transition-all duration-300 ease-out"
                style={{
                  left: `${(p.baseX + WORLD_W / 2) * (200 / WORLD_W)}px`,
                  top: `${(p.baseY + WORLD_H / 2) * (160 / WORLD_H)}px`,
                  backgroundColor: t.text,
                  opacity: 0.2,
                }}
              />
            ))}

            <div
              ref={minimapViewportRef}
              className="absolute border-[1.5px] rounded-[3px] will-change-transform pointer-events-none transition-transform duration-75 ease-linear"
              style={{
                borderColor: ac,
                backgroundColor: hexToRgba(ac, 0.05),
                boxShadow: `0 0 15px ${hexToRgba(ac, 0.25)}`,
                zIndex: 20,
              }}
            />
          </div>
        </div>
      </div>

      {selectedProject ? (
      <div
        className="absolute z-50 interactive-panel pointer-events-auto bottom-0 left-0 w-full h-[75vh] rounded-t-3xl md:h-auto md:top-6 md:bottom-6 md:left-auto md:right-6 md:w-[420px] md:rounded-3xl overflow-hidden shadow-2xl flex flex-col border animate-fade-up"
        style={{
          ...glassStyle,
          borderColor: hexToRgba(t.borderStrong, isDark ? 0.2 : 0.4),
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          backgroundColor: hexToRgba(t.surface, isDark ? 0.75 : 0.9),
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
            <div className="flex-none p-6 flex justify-between items-center border-b" style={{ borderColor: hexToRgba(t.border, 0.3) }}>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase opacity-60">Entry No. {selectedProject.id.replace("p", "0")}</span>
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  closeProject();
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors focus:outline-none focus-visible:ring-2"
                style={{ outlineColor: ac }}
                aria-label="Close panel"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 custom-scrollbar">
              <div className="w-full aspect-[4/3] rounded-2xl shadow-inner relative overflow-hidden bg-neutral-900">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  draggable={false}
                  decoding="async"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
              </div>

              <div>
                <h2 className="text-3xl font-semibold mb-4 tracking-tight leading-tight">{selectedProject.title}</h2>
                <div className="flex flex-wrap gap-2 text-xs font-semibold mb-8 tracking-wide">
                  <span className="px-3 py-1.5 rounded-md uppercase" style={{ backgroundColor: hexToRgba(t.text, 0.05), color: t.textSecondary }}>{selectedProject.category}</span>
                  <span className="px-3 py-1.5 rounded-md uppercase" style={{ backgroundColor: hexToRgba(t.text, 0.05), color: t.textSecondary }}>{selectedProject.year}</span>
                  <span className="px-3 py-1.5 rounded-md uppercase" style={{ backgroundColor: hexToRgba(t.text, 0.05), color: t.textSecondary }}>{selectedProject.location}</span>
                </div>

                <h3 className="text-xs font-bold mb-3 opacity-60 uppercase tracking-widest">Overview</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: t.textSecondary }}>
                  {selectedProject.description}
                </p>
              </div>

              <div className="mt-auto pt-6">
                <a
                  href={`https://unsplash.com/s/photos/${encodeURIComponent(selectedProject.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 rounded-xl font-semibold text-[13px] tracking-wide uppercase transition-transform active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: ac, color: "#ffffff" }}
                >
                  Explore Documentation
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
              </div>
            </div>
      </div>
      ) : null}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${hexToRgba(t.borderStrong, 0.5)}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${t.borderStrong}; }
      `}} />
    </div>
  );
}

export default LiquidMasonryParallaxGrid;
