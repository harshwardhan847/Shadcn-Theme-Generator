// Re-export PaletteType if needed by generatePalette, or import it
// For now, assume PaletteType is defined elsewhere or passed in.
// If generatePalette is the ONLY place PaletteType is used, define it here.
// Keeping it in theme-generator.tsx is fine if state depends on it there.
import type { PaletteType } from "./theme-generator"; // Adjust if PaletteType moves

// --- Basic Color Conversions ---

export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        Number.parseInt(result[1], 16),
        Number.parseInt(result[2], 16),
        Number.parseInt(result[3], 16),
      ]
    : [0, 0, 0]; // Return black on error
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  // Clamp values to 0-255
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .padStart(6, "0")}`;
};

export const rgbToHsl = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

export const hslToRgb = (
  h: number,
  s: number,
  l: number
): [number, number, number] => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255]; // Don't round here, let rgbToHex handle it
};

export const hexToHsl = (hex: string): [number, number, number] => {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb[0], rgb[1], rgb[2]);
};

export const hslToHex = (h: number, s: number, l: number): string => {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

// --- Color Adjustments ---

export const adjustLightness = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  // Clamp lightness between 0 and 100
  const newL = Math.max(0, Math.min(100, l + amount));
  return hslToHex(h, s, newL);
};

export const adjustSaturation = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  // Clamp saturation between 0 and 100
  const newS = Math.max(0, Math.min(100, s + amount));
  return hslToHex(h, newS, l);
};

// --- Color Generation ---

export const randomColor = (): string => {
  // Ensure it generates a full 6-digit hex code
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

// --- Contrast Calculation ---

// Calculate relative luminance
const getLuminance = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928
      ? srgb / 12.92
      : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const getContrastRatio = (color1: string, color2: string): number => {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// Adjust color2 to meet minimum contrast against color1
export const ensureContrast = (
  color1: string, // The fixed color (e.g., background)
  color2: string, // The color to adjust (e.g., foreground)
  minContrast = 4.5
): string => {
  let adjustedColor = color2;
  let currentContrast = getContrastRatio(color1, adjustedColor);
  let attempts = 0;
  const MAX_ATTEMPTS = 20; // Prevent infinite loops

  // Determine if color1 is light or dark
  const l1 = getLuminance(color1);
  const targetDirection = l1 > 0.5 ? -1 : 1; // -1 to darken color2, 1 to lighten color2

  while (currentContrast < minContrast && attempts < MAX_ATTEMPTS) {
    const [h, s, l] = hexToHsl(adjustedColor);
    // Adjust lightness slightly in the target direction
    const newL = Math.max(0, Math.min(100, l + targetDirection * 5)); // Adjust step as needed

    // If lightness hits boundary and still fails, maybe adjust saturation slightly?
    // Or just return the best effort. For now, just adjust lightness.
    if (newL === l) break; // Stop if lightness can't be adjusted further

    adjustedColor = hslToHex(h, s, newL);
    currentContrast = getContrastRatio(color1, adjustedColor);
    attempts++;
  }

  // Optional: If still below contrast after attempts, return a default safe color?
  // if (currentContrast < minContrast) {
  //   return l1 > 0.5 ? '#000000' : '#ffffff';
  // }

  return adjustedColor;
};

// --- Palette Generation ---

export const generatePalette = (
  baseColor: string,
  type: PaletteType
): string[] => {
  const [h, s, l] = hexToHsl(baseColor);
  const palette: string[] = [baseColor]; // Start with the base color

  // Helper to generate variations
  const generateVariations = (
    hueShift: number,
    satMod: number,
    lightMod: number
  ) =>
    hslToHex(
      (h + hueShift + 360) % 360,
      Math.max(0, Math.min(100, s * satMod)),
      Math.max(0, Math.min(100, l * lightMod))
    );

  switch (type) {
    case "monochromatic":
      palette.push(hslToHex(h, s, Math.min(95, l + 25))); // Lighter
      palette.push(hslToHex(h, s, Math.min(90, l + 15))); // Light
      palette.push(hslToHex(h, s, Math.max(10, l - 15))); // Dark
      palette.push(hslToHex(h, s, Math.max(5, l - 25))); // Darker
      break;
    case "analogous":
      palette.push(hslToHex((h - 30 + 360) % 360, s, l));
      palette.push(hslToHex((h - 15 + 360) % 360, s, l));
      palette.push(hslToHex((h + 15) % 360, s, l));
      palette.push(hslToHex((h + 30) % 360, s, l));
      break;
    case "complementary":
      const complementHue = (h + 180) % 360;
      palette.push(hslToHex(h, s, Math.min(90, l + 20))); // Light base
      palette.push(hslToHex(h, s, Math.max(20, l - 20))); // Dark base
      palette.push(hslToHex(complementHue, s, l)); // Complement
      palette.push(hslToHex(complementHue, s, Math.min(90, l + 20))); // Light complement
      break;
    case "triadic":
      palette.push(hslToHex((h + 120) % 360, s, l));
      palette.push(hslToHex((h + 240) % 360, s, l));
      palette.push(hslToHex(h, Math.max(10, s - 15), Math.min(90, l + 15))); // Desaturated Light base
      palette.push(hslToHex(h, s, Math.max(15, l - 15))); // Dark base
      break;
    case "tetradic": // Rectangular Tetradic
      palette.push(hslToHex((h + 60) % 360, s, l));
      palette.push(hslToHex((h + 180) % 360, s, l));
      palette.push(hslToHex((h + 240) % 360, s, l));
      palette.push(hslToHex(h, s, Math.min(90, l + 20))); // Light base
      break;
    case "pastel":
      const pastelSat = Math.max(20, Math.min(40, s * 0.5));
      const pastelLight = Math.min(95, Math.max(85, l + 20));
      palette.push(hslToHex(h, pastelSat, pastelLight));
      palette.push(hslToHex((h + 60) % 360, pastelSat, pastelLight));
      palette.push(hslToHex((h + 120) % 360, pastelSat, pastelLight));
      palette.push(hslToHex((h + 180) % 360, pastelSat, pastelLight));
      break;
    case "vibrant":
      const vibrantSat = Math.max(80, Math.min(100, s * 1.2));
      const vibrantLight = Math.max(40, Math.min(60, l));
      palette.push(hslToHex(h, vibrantSat, vibrantLight));
      palette.push(hslToHex((h + 72) % 360, vibrantSat, vibrantLight)); // Pentadic spread
      palette.push(hslToHex((h + 144) % 360, vibrantSat, vibrantLight));
      palette.push(hslToHex((h + 216) % 360, vibrantSat, vibrantLight));
      break;
    case "earthy":
      palette.push(hslToHex(30, 40, 70)); // Light brown/tan
      palette.push(hslToHex(40, 60, 50)); // Medium brown
      palette.push(hslToHex(20, 70, 40)); // Dark brown/reddish
      palette.push(hslToHex(90, 30, 60)); // Olive/moss green
      break;
    case "cool":
      palette.push(hslToHex(210, 70, 60)); // Blue
      palette.push(hslToHex(180, 60, 50)); // Teal
      palette.push(hslToHex(240, 50, 70)); // Light Purple/Indigo
      palette.push(hslToHex(270, 60, 60)); // Purple
      break;
    case "warm":
      palette.push(hslToHex(0, 80, 60)); // Red
      palette.push(hslToHex(30, 90, 55)); // Orange
      palette.push(hslToHex(50, 90, 60)); // Yellow/Gold
      palette.push(hslToHex(15, 70, 50)); // Burnt Orange/Brown
      break;
    default:
      // Return just the base color if type is unknown
      return [baseColor];
  }
  // Ensure palette has at least 3 colors for random theme generation, pad if needed
  while (palette.length < 3) {
    palette.push(
      adjustLightness(
        palette[palette.length - 1],
        palette.length % 2 === 0 ? 10 : -10
      )
    );
  }
  return palette.slice(0, 5); // Return max 5 colors
};

// --- CSS Formatting ---

// Function to convert hex to HSL string for CSS variables
export const convertHexToHSLString = (hex: string): string | null => {
  try {
    const [h, s, l] = hexToHsl(hex);
    // Format for CSS: h s% l%
    return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
  } catch (e) {
    console.error(`Failed to convert hex ${hex} to HSL string:`, e);
    return null; // Return null or a default value on error
  }
};

// Helper to convert camelCase to kebab-case for CSS variables
export const kebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
};

// --- Theme Specific Utilities ---

// Function to create subtle background variations based on a base color
export const createBackgroundVariations = (
  baseColor: string,
  isDark: boolean
): {
  background: string;
  card: string;
  popover: string;
  border: string;
  input: string;
} => {
  const background = baseColor;
  if (isDark) {
    // Dark mode: card/popover slightly lighter, border/input noticeably lighter
    return {
      background,
      card: adjustLightness(background, 2), // Subtle change
      popover: adjustLightness(background, 3), // Slightly more noticeable
      border: adjustLightness(background, 8), // Clearly lighter for separation
      input: adjustLightness(background, 7), // Similar to border
    };
  } else {
    // Light mode: card/popover slightly darker/off-white, border/input noticeably darker
    return {
      background,
      card: adjustLightness(background, -2), // Subtle change (e.g., #fafafa)
      popover: adjustLightness(background, -2), // Subtle change
      border: adjustLightness(background, -8), // Clearly darker for separation (e.g., #e4e4e7)
      input: adjustLightness(background, -7), // Similar to border
    };
  }
};
