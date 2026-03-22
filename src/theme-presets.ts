export type ThemePalette = readonly [string, string, string, string, string];

/** [0]=accent, [1]=teamA main, [2]=teamB main, [3][4]=extra */
export const THEME_PRESETS: readonly ThemePalette[] = [
  // Default
  ['#cdb4db', '#a2d2ff', '#ffafcc', '#bde0fe', '#ffc8dd'],
  // Light (avg brightness desc)
  ['#d4a373', '#ccd5ae', '#faedcd', '#e9edc9', '#fefae0'],
  ['#d8e2dc', '#ffe5d9', '#f4acb7', '#ffcad4', '#9d8189'],
  ['#ff686b', '#84dcc6', '#ffa69e', '#a5ffd6', '#ffffff'],
  ['#ff9f1c', '#ffbf69', '#2ec4b6', '#ffffff', '#cbf3f0'],
  ['#2c6e49', '#4c956c', '#ffc9b9', '#fefee3', '#d68c45'],
  ['#3d348b', '#7678ed', '#f18701', '#f7b801', '#f35b04'],
  ['#461220', '#8c2f39', '#fcb9b2', '#b23a48', '#fed0bb'],
  ['#023047', '#219ebc', '#fb8500', '#ffb703', '#8ecae6'],
  ['#000000', '#14213d', '#e5e5e5', '#fca311', '#ffffff'],
  ['#0a100d', '#a22c29', '#b9baa3', '#d6d5c9', '#902923'],
  // Dark (avg brightness desc)
  ['#6f1d1b', '#bb9457', '#99582a', '#432818', '#ffe6a7'],
  ['#e63946', '#a8dadc', '#1d3557', '#457b9d', '#f1faee'],
  ['#001524', '#15616d', '#ff7d00', '#ffecd1', '#78290f'],
  ['#000000', '#14213d', '#fca311', '#e5e5e5', '#ffffff'],
  ['#d62839', '#ba324f', '#175676', '#4ba3c3', '#cce6f4'],
  ['#820263', '#d90368', '#2e294e', '#eadeda', '#ffd400'],
  ['#780000', '#c1121f', '#003049', '#fdf0d5', '#669bbc'],
] as const;

/** t=0 → main, t=1 → white; larger t = brighter panel */
const PANEL_TOWARD_WHITE = 0.28;
const HOVER_TOWARD_WHITE = 0.42;

function parseRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '');
  return [
    parseInt(m.slice(0, 2), 16),
    parseInt(m.slice(2, 4), 16),
    parseInt(m.slice(4, 6), 16),
  ];
}

function luminance(hex: string): number {
  const [r, g, b] = parseRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function contrastText(hex: string): string {
  return luminance(hex) > 140 ? '#1f2937' : '#ffffff';
}

function mixWithWhite(hex: string, towardWhite: number): string {
  const [r, g, b] = parseRgb(hex);
  const t = towardWhite;
  const R = Math.round(r * (1 - t) + 255 * t);
  const G = Math.round(g * (1 - t) + 255 * t);
  const B = Math.round(b * (1 - t) + 255 * t);
  return `#${[R, G, B].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

export function applyThemePalette(palette: ThemePalette): void {
  const [accent, mainA, mainB] = palette;
  const root = document.documentElement;
  root.style.setProperty('--color-pastel-purple', accent);
  root.style.setProperty('--color-pastel-blue-light', mixWithWhite(mainA, PANEL_TOWARD_WHITE));
  root.style.setProperty('--color-pastel-blue-hover', mixWithWhite(mainA, HOVER_TOWARD_WHITE));
  root.style.setProperty('--color-pastel-blue-dark', mainA);
  root.style.setProperty('--color-pastel-pink-light', mixWithWhite(mainB, PANEL_TOWARD_WHITE));
  root.style.setProperty('--color-pastel-pink-hover', mixWithWhite(mainB, HOVER_TOWARD_WHITE));
  root.style.setProperty('--color-pastel-pink-dark', mainB);
  root.style.setProperty('--text-on-blue-dark', contrastText(mainA));
  root.style.setProperty('--text-on-pink-dark', contrastText(mainB));
}

export function themeSwatchBackground(palette: ThemePalette): string {
  const [, left, right] = palette;
  return `linear-gradient(90deg, ${left} 50%, ${right} 50%)`;
}
