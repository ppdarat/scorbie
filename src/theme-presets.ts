export type ThemePalette = readonly [string, string, string, string, string];

/**
 * [0]=accent, [1]=teamA main, [2]=teamB main, [3][4]=extra
 * Default ก่อน; คู่สีคอนทราสต์ (ม่วง×ส้ม / เขียว×แดง) อยู่ช่อง 2 กับ 5
 */
export const THEME_PRESETS: readonly ThemePalette[] = [
  // Default
  ['#cdb4db', '#a2d2ff', '#ffafcc', '#bde0fe', '#ffc8dd'],
  // แทนที่ธีมเดิม #2: ม่วงเข้ม × ส้มสด
  ['#5a189a', '#240046', '#fb5607', '#3c096c', '#ffbe0b'],
  ['#d4a373', '#ccd5ae', '#faedcd', '#e9edc9', '#fefae0'],
  ['#9381ff', '#b8b8ff', '#f8f7ff', '#ffeedd', '#ffd8be'],
  // แทนที่ธีมเดิม #6: เขียวเข้ม × แดง
  ['#007f5f', '#004b3d', '#e01e37', '#2b9348', '#ffe8e8'],
  ['#ff686b', '#84dcc6', '#ffa69e', '#a5ffd6', '#ffffff'],
  ['#0081a7', '#00afb9', '#fdfcdc', '#fed9b7', '#f07167'],
  ['#3d348b', '#7678ed', '#f18701', '#f7b801', '#f35b04'],
  ['#023047', '#219ebc', '#fb8500', '#ffb703', '#8ecae6'],
  // แดง × ฟ้า (ซ้าย #e63946 / ขวา #00b4d8)
  ['#e63946', '#e63946', '#00b4d8', '#457b9d', '#1d3557'],
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

/** ตรงกับพื้น panel บนหน้านับคะแนน (ผสมขาวเท่า applyThemePalette) */
export function themeSwatchBackground(palette: ThemePalette): string {
  const [, mainA, mainB] = palette;
  const left = mixWithWhite(mainA, PANEL_TOWARD_WHITE);
  const right = mixWithWhite(mainB, PANEL_TOWARD_WHITE);
  return `linear-gradient(90deg, ${left} 50%, ${right} 50%)`;
}
