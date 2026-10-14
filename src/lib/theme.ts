export type Theme = "light" | "dark";
export type Accent = "blue" | "green" | "orange" | "pink" | "violet" | "neutral";

export const DEFAULT_THEME: Theme = "dark";
export const DEFAULT_ACCENT: Accent = "blue";

export type BlockProps = {
  theme?: Theme;
  accent?: Accent;
  embedded?: boolean;
};

export function surfaceTokens(theme: Theme) {
  if (theme === "light") {
    return {
      bg: "#F7F6F2",
      surface: "#FFFFFF",
      text: "#1C1C1C",
      textSecondary: "rgba(28, 28, 28, 0.62)",
      border: "#E8E6E0",
      borderStrong: "#D4D1C9",
    };
  }

  return {
    bg: "#1C1C1C",
    surface: "#282825",
    text: "#F7F6F2",
    textSecondary: "rgba(247, 246, 242, 0.62)",
    border: "rgba(255, 255, 255, 0.12)",
    borderStrong: "rgba(255, 255, 255, 0.22)",
  };
}

const ACCENT_HEX: Record<Accent, string> = {
  blue: "#0093FF",
  green: "#22C55E",
  orange: "#F97316",
  pink: "#EC4899",
  violet: "#8B5CF6",
  neutral: "#FFFFFF",
};

export function resolvedAccentHex(accent: Accent, theme: Theme) {
  if (accent === "neutral") {
    return theme === "light" ? "#1C1C1C" : "#FFFFFF";
  }
  return ACCENT_HEX[accent];
}
