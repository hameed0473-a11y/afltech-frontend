export interface AppThemeConfig {
  id: string;
  name: string;
  description: string;
  primary: string;           // Base Primary Hex
  primaryDark: string;       // Darker shade
  primaryLight: string;      // Light background accent tint
  accent: string;            // Secondary visual pop color (e.g. Amber/Teal/Rose)
  accentHeader: string;      // Heading highlight text color
  cardBorder: string;        // Soft border tone
  badgeBg: string;           // Badges & pill backdrops
  badgeText: string;         // Badges & pill text
  patternClass: string;      // Background radial/mesh styling modifier
}

export const APP_THEMES: AppThemeConfig[] = [
  {
    id: "classic",
    name: "Classic Indigo & Sapphire",
    description: "Our original sleek corporate look sporting professional deep azure accents.",
    primary: "#4f46e5",
    primaryDark: "#3730a3",
    primaryLight: "#f5f3ff",
    accent: "#6366f1",
    accentHeader: "text-indigo-650",
    cardBorder: "border-indigo-150",
    badgeBg: "#ede9fe",
    badgeText: "#4338ca",
    patternClass: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-800 via-indigo-950 to-slate-950"
  },
  {
    id: "emerald",
    name: "Emerald & Majestic Gold",
    description: "Premium social fundraising theme featuring deep moss greens and shimmering golden amber accents.",
    primary: "#047857", // emerald-700
    primaryDark: "#065f46", // emerald-800
    primaryLight: "#f0fdf4", // emerald-50
    accent: "#d97706", // amber-600 (gold)
    accentHeader: "text-emerald-700",
    cardBorder: "border-emerald-150",
    badgeBg: "#e8f5e9",
    badgeText: "#1b5e20",
    patternClass: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-800 via-emerald-950 to-slate-950"
  },
  {
    id: "cosmic",
    name: "Midnight Carbon & Crimson",
    description: "Stealthy modern high-tech layout with crimson highlights and ink-slate card styles.",
    primary: "#1e293b", // slate-800
    primaryDark: "#0f172a", // slate-900
    primaryLight: "#fff1f2", // rose-50
    accent: "#e11d48", // rose-600
    accentHeader: "text-rose-600",
    cardBorder: "border-slate-800",
    badgeBg: "#ffe4e6",
    badgeText: "#be123c",
    patternClass: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950 via-slate-900 to-black"
  },
  {
    id: "editorial",
    name: "Terracotta Sienna & Sand",
    description: "Warm, grounding, and organic community-driven palette with rustic tones.",
    primary: "#c2410c", // orange-800/sienna
    primaryDark: "#9a3412", // orange-900
    primaryLight: "#fff7ed", // orange-50
    accent: "#ea580c", // orange-600
    accentHeader: "text-amber-800",
    cardBorder: "border-amber-100",
    badgeBg: "#ffedd5",
    badgeText: "#9a3412",
    patternClass: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-800 via-orange-950 to-stone-950"
  }
];
