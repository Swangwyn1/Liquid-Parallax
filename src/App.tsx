import { useState } from "react";
import { LiquidMasonryParallaxGrid } from "@/components/blocks/LiquidMasonryParallaxGrid";
import type { Accent, Theme } from "@/lib/theme";

const ACCENTS: Accent[] = ["blue", "green", "orange", "pink", "violet", "neutral"];

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<Accent>("blue");

  return (
    <div className="relative min-h-screen">
      <LiquidMasonryParallaxGrid theme={theme} accent={accent} />
      <div className="fixed bottom-6 left-6 z-[60] flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto flex gap-1 p-1 rounded-full border border-white/15 bg-black/35 backdrop-blur-xl">
          {(["dark", "light"] as Theme[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className="px-3 h-8 rounded-full text-[11px] font-medium capitalize"
              style={{
                backgroundColor: theme === value ? "rgba(255,255,255,0.18)" : "transparent",
                color: "#F7F6F2",
              }}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="pointer-events-auto flex gap-1 p-1 rounded-full border border-white/15 bg-black/35 backdrop-blur-xl">
          {ACCENTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAccent(value)}
              className="px-2.5 h-8 rounded-full text-[11px] font-medium capitalize"
              style={{
                backgroundColor: accent === value ? "rgba(255,255,255,0.18)" : "transparent",
                color: "#F7F6F2",
              }}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
