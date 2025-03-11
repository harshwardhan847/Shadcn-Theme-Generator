"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Copy, Moon, Sun, Wand2 } from "lucide-react";
import { useTheme } from "next-themes";
import ColorPicker from "@/components/color-picker";
import ComponentPreview from "@/components/component-preview";
import LandingPreview from "@/components/landing-preview";
import RadiusSlider from "@/components/radius-slider";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Default theme values based on Shadcn UI
const defaultLightTheme = {
  background: "#ffffff",
  foreground: "#09090b",
  card: "#ffffff",
  cardForeground: "#09090b",
  popover: "#ffffff",
  popoverForeground: "#09090b",
  primary: "#18181b",
  primaryForeground: "#ffffff",
  secondary: "#f4f4f5",
  secondaryForeground: "#18181b",
  muted: "#f4f4f5",
  mutedForeground: "#71717a",
  accent: "#f4f4f5",
  accentForeground: "#18181b",
  destructive: "#ef4444",
  destructiveForeground: "#f8fafc",
  border: "#e4e4e7",
  input: "#e4e4e7",
  ring: "#a1a1aa",
  radius: "0.5rem",
};

const defaultDarkTheme = {
  background: "#09090b",
  foreground: "#f8fafc",
  card: "#09090b",
  cardForeground: "#f8fafc",
  popover: "#09090b",
  popoverForeground: "#f8fafc",
  primary: "#f8fafc",
  primaryForeground: "#18181b",
  secondary: "#27272a",
  secondaryForeground: "#f8fafc",
  muted: "#27272a",
  mutedForeground: "#a1a1aa",
  accent: "#27272a",
  accentForeground: "#f8fafc",
  destructive: "#7f1d1d",
  destructiveForeground: "#ef4444",
  border: "#27272a",
  input: "#27272a",
  ring: "#7f7f7f",
  radius: "0.5rem",
};

// Color palette types
type PaletteType =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "pastel"
  | "vibrant"
  | "earthy"
  | "cool"
  | "warm";

// Color conversion utilities
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        Number.parseInt(result[1], 16),
        Number.parseInt(result[2], 16),
        Number.parseInt(result[3], 16),
      ]
    : [0, 0, 0];
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

const rgbToHsl = (
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

const hslToRgb = (
  h: number,
  s: number,
  l: number
): [number, number, number] => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
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

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const hexToHsl = (hex: string): [number, number, number] => {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb[0], rgb[1], rgb[2]);
};

const hslToHex = (h: number, s: number, l: number): string => {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

// Function to adjust color lightness
const adjustLightness = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, Math.min(100, l + amount)));
};

// Function to adjust color saturation
const adjustSaturation = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, Math.max(0, Math.min(100, s + amount)), l);
};

// Function to generate a random color in hex format
const randomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
};

// Function to calculate contrast ratio between two colors
const getContrastRatio = (color1: string, color2: string): number => {
  // Convert hex to rgb
  const getRGB = (hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  // Calculate luminance
  const getLuminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((val) => {
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const rgb1 = getRGB(color1);
  const rgb2 = getRGB(color2);
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);

  // Return contrast ratio
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// Function to adjust color to meet contrast requirements
const ensureContrast = (
  color1: string,
  color2: string,
  minContrast = 4.5
): string => {
  let attempts = 0;
  let newColor = color2;
  let contrast = getContrastRatio(color1, newColor);

  // Try to adjust the color to meet contrast requirements
  while (contrast < minContrast && attempts < 20) {
    // Adjust the color by making it lighter or darker
    const [h, s, l] = hexToHsl(newColor);
    const [_, __, l1] = hexToHsl(color1);

    // Determine if we should lighten or darken based on the background
    if (l1 > 50) {
      // Background is light, make text darker
      newColor = hslToHex(h, s, Math.max(0, l - 5));
    } else {
      // Background is dark, make text lighter
      newColor = hslToHex(h, s, Math.min(100, l + 5));
    }

    contrast = getContrastRatio(color1, newColor);
    attempts++;
  }

  return newColor;
};

// Update the generatePalette function to create more diverse and usable palettes

// Replace the existing generatePalette function with this improved version:

// Function to generate a color palette based on a base color
const generatePalette = (baseColor: string, type: PaletteType): string[] => {
  const [h, s, l] = hexToHsl(baseColor);

  switch (type) {
    case "monochromatic":
      return [
        baseColor, // Base color
        hslToHex(h, s, 90), // Very light
        hslToHex(h, s, 75), // Light
        hslToHex(h, s, 35), // Dark
        hslToHex(h, s, 20), // Very dark
      ];

    case "analogous":
      return [
        baseColor, // Base color
        hslToHex((h - 30 + 360) % 360, s, l), // -30 degrees
        hslToHex((h - 15 + 360) % 360, s, l), // -15 degrees
        hslToHex((h + 15) % 360, s, l), // +15 degrees
        hslToHex((h + 30) % 360, s, l), // +30 degrees
      ];

    case "complementary":
      return [
        baseColor, // Base color
        hslToHex(h, s, 80), // Light primary
        hslToHex(h, s, 30), // Dark primary
        hslToHex((h + 180) % 360, s, 80), // Light complement
        hslToHex((h + 180) % 360, s, 50), // Complement
      ];

    case "triadic":
      return [
        baseColor, // Base color
        hslToHex((h + 120) % 360, s, l), // +120 degrees
        hslToHex((h + 240) % 360, s, l), // +240 degrees
        hslToHex(h, s * 0.7, 85), // Light version of base
        hslToHex(h, s * 0.7, 25), // Dark version of base
      ];

    case "tetradic":
      return [
        baseColor, // Base color
        hslToHex((h + 90) % 360, s, l), // +90 degrees
        hslToHex((h + 180) % 360, s, l), // +180 degrees
        hslToHex((h + 270) % 360, s, l), // +270 degrees
        hslToHex(h, s, 85), // Light version of base
      ];

    case "pastel":
      return [
        hslToHex(h, 25, 90), // Pastel primary
        hslToHex((h + 60) % 360, 25, 90), // Pastel secondary
        hslToHex((h + 120) % 360, 25, 90), // Pastel tertiary
        hslToHex((h + 180) % 360, 25, 90), // Pastel complement
        hslToHex((h + 240) % 360, 25, 90), // Pastel accent
      ];

    case "vibrant":
      return [
        hslToHex(h, 90, 60), // Vibrant primary
        hslToHex((h + 60) % 360, 90, 60), // Vibrant secondary
        hslToHex((h + 120) % 360, 90, 60), // Vibrant tertiary
        hslToHex((h + 180) % 360, 90, 60), // Vibrant complement
        hslToHex((h + 240) % 360, 90, 60), // Vibrant accent
      ];

    case "earthy":
      return [
        hslToHex(30, 40, 70), // Light brown
        hslToHex(40, 60, 50), // Medium brown
        hslToHex(20, 70, 40), // Dark brown
        hslToHex(60, 30, 60), // Olive
        hslToHex(80, 20, 50), // Moss
      ];

    case "cool":
      return [
        hslToHex(210, 70, 60), // Blue
        hslToHex(180, 60, 50), // Teal
        hslToHex(150, 50, 60), // Green
        hslToHex(240, 60, 70), // Light purple
        hslToHex(270, 70, 50), // Purple
      ];

    case "warm":
      return [
        hslToHex(0, 70, 60), // Red
        hslToHex(20, 80, 50), // Orange
        hslToHex(40, 90, 60), // Light orange
        hslToHex(60, 80, 60), // Yellow
        hslToHex(30, 60, 40), // Brown
      ];

    default:
      return [baseColor];
  }
};

// Function to convert hex to HSL string for CSS
const hexToHSL = (hex: string): string | null => {
  const [h, s, l] = hexToHsl(hex);
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
};

// Helper to convert camelCase to kebab-case
const kebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
};

// Add a new function to create more sophisticated background variations

// Add this function after the other color utility functions:

// Function to create subtle background variations
const createBackgroundVariations = (
  baseColor: string,
  isDark: boolean
): {
  background: string;
  card: string;
  popover: string;
  border: string;
  input: string;
} => {
  if (isDark) {
    // For dark themes, we want subtle lighter variations
    const background = baseColor; // Usually "#09090b" or similar
    return {
      background,
      card: adjustLightness(background, 2), // Slightly lighter
      popover: adjustLightness(background, 3), // Slightly lighter than card
      border: adjustLightness(background, 10), // Visible but subtle border
      input: adjustLightness(background, 8), // Visible form elements
    };
  } else {
    // For light themes, we want subtle darker/grayer variations
    const background = baseColor; // Usually "#ffffff" or similar
    return {
      background,
      card: adjustLightness(background, 3), // Same as background
      popover: adjustLightness(background, 3), // Same as background
      border: adjustLightness(background, -8), // Slightly darker for borders
      input: adjustLightness(background, -10), // Slightly darker for inputs
    };
  }
};

export default function ThemeGenerator() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("components");
  const [lightTheme, setLightTheme] = useState(defaultLightTheme);
  const [darkTheme, setDarkTheme] = useState(defaultDarkTheme);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"light" | "dark" | "system">(
    "system"
  );
  const [paletteType, setPaletteType] = useState<PaletteType>("complementary");

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply light theme variables
    Object.entries(lightTheme).forEach(([key, value]) => {
      if (key === "radius") {
        root.style.setProperty("--radius", value);
        return;
      }
      // Convert hex to hsl for shadcn compatibility
      const hslValue = hexToHSL(value);
      if (hslValue) {
        root.style.setProperty(`--${kebabCase(key)}`, hslValue);
      }
    });

    // Apply dark theme variables within the dark selector
    const darkStyles = Object.entries(darkTheme)
      .filter(([key]) => key !== "radius")
      .map(([key, value]) => {
        const hslValue = hexToHSL(value);
        return `--${kebabCase(key)}: ${hslValue};`;
      })
      .join("\n");

    // Update or create the dark mode style element
    let darkStyleElement = document.getElementById("dark-theme-vars");
    if (!darkStyleElement) {
      darkStyleElement = document.createElement("style");
      darkStyleElement.id = "dark-theme-vars";
      document.head.appendChild(darkStyleElement);
    }
    darkStyleElement.textContent = `.dark {\n${darkStyles}\n}`;
  }, [lightTheme, darkTheme]);

  // Update a specific color in the theme
  const updateThemeColor = (
    themeType: "light" | "dark",
    key: string,
    value: string
  ) => {
    if (themeType === "light") {
      setLightTheme((prev) => ({ ...prev, [key]: value }));
    } else {
      setDarkTheme((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Update radius for both themes
  const updateRadius = (value: string) => {
    setLightTheme((prev) => ({ ...prev, radius: value }));
    setDarkTheme((prev) => ({ ...prev, radius: value }));
  };

  // Generate CSS variables for copying
  const generateCssVariables = () => {
    const lightVars = Object.entries(lightTheme)
      .map(([key, value]) => {
        if (key === "radius") {
          return `  --radius: ${value};`;
        }
        const hslValue = hexToHSL(value);
        return `  --${kebabCase(key)}: ${hslValue};`;
      })
      .join("\n");

    const darkVars = Object.entries(darkTheme)
      .map(([key, value]) => {
        if (key === "radius") return "";
        const hslValue = hexToHSL(value);
        return `  --${kebabCase(key)}: ${hslValue};`;
      })
      .filter(Boolean)
      .join("\n");

    return `:root {\n${lightVars}\n}\n\n.dark {\n${darkVars}\n}`;
  };

  // Copy CSS variables to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCssVariables());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset themes to default
  const resetThemes = () => {
    setLightTheme(defaultLightTheme);
    setDarkTheme(defaultDarkTheme);
  };

  // Now update the generateRandomTheme function to use this new function:

  // Enhanced function to generate a random theme
  const generateRandomTheme = () => {
    // Generate a base color for the palette
    const baseColor = randomColor();

    // Generate a palette based on the selected type
    const palette = generatePalette(baseColor, paletteType);

    // Light theme constants
    const lightBg = adjustSaturation(adjustLightness(palette[1], 10), -50);
    const lightFg = "#09090b";

    // Dark theme constants
    const darkBg = "#09090b";
    const darkFg = "#ffffff";

    // Create background variations
    const lightBackgrounds = createBackgroundVariations(lightBg, false);
    const darkBackgrounds = createBackgroundVariations(darkBg, true);

    // Create light theme with ALL variables properly set
    const newLightTheme = {
      // Base colors
      background: lightBackgrounds.background,
      foreground: lightFg,

      // Card and popover
      card: lightBackgrounds.card,
      cardForeground: lightFg,
      popover: lightBackgrounds.popover,
      popoverForeground: lightFg,

      // Primary colors - use the base color from the palette
      primary: palette[0],
      primaryForeground: ensureContrast(palette[0], "#ffffff"),

      // Secondary colors - use a different color from the palette
      secondary: adjustLightness(palette[1], 30),
      secondaryForeground: ensureContrast(
        adjustLightness(palette[1], 30),
        lightFg
      ),

      // Muted colors - desaturated version of secondary
      muted: adjustSaturation(adjustLightness(palette[1], 35), -30),
      mutedForeground: ensureContrast(
        adjustSaturation(adjustLightness(palette[1], 35), -30),
        "#71717a",
        3
      ),

      // Accent colors - use another color from the palette
      accent: adjustLightness(palette[2], 30),
      accentForeground: ensureContrast(
        adjustLightness(palette[2], 30),
        lightFg
      ),

      // Destructive colors - typically red
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",

      // Border and input colors
      border: lightBackgrounds.border,
      input: lightBackgrounds.input,
      ring: adjustLightness(palette[0], 20),

      // Keep the existing radius
      radius: lightTheme.radius,
    };

    // Create dark theme with ALL variables properly set
    const newDarkTheme = {
      // Base colors
      background: darkBackgrounds.background,
      foreground: darkFg,

      // Card and popover
      card: darkBackgrounds.card,
      cardForeground: darkFg,
      popover: darkBackgrounds.popover,
      popoverForeground: darkFg,

      // Primary colors - use a brighter version of the base color
      primary: adjustLightness(palette[0], 20),
      primaryForeground: ensureContrast(
        adjustLightness(palette[0], 20),
        darkBg
      ),

      // Secondary colors - darker version of the palette color
      secondary: adjustLightness(palette[1], -30),
      secondaryForeground: ensureContrast(
        adjustLightness(palette[1], -30),
        darkFg
      ),

      // Muted colors - very dark version of secondary
      muted: adjustLightness(palette[1], -40),
      mutedForeground: ensureContrast(
        adjustLightness(palette[1], -40),
        "#a1a1aa",
        3
      ),

      // Accent colors - darker version of the accent
      accent: adjustLightness(palette[2], -30),
      accentForeground: ensureContrast(
        adjustLightness(palette[2], -30),
        darkFg
      ),

      // Destructive colors - darker red
      destructive: "#7f1d1d",
      destructiveForeground: "#ef4444",

      // Border and input colors
      border: darkBackgrounds.border,
      input: darkBackgrounds.input,
      ring: adjustLightness(palette[0], -20),

      // Keep the existing radius
      radius: darkTheme.radius,
    };

    setLightTheme(newLightTheme);
    setDarkTheme(newDarkTheme);
  };

  return (
    <div
      className={cn(
        "transition-colors w-full h-full bg-background text-foreground",
        previewMode === "dark" ? "dark" : ""
      )}
    >
      <div className="container  mx-auto py-6 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Shadcn UI Theme Generator</h1>
          <p className="text-muted-foreground">
            Customize your theme with this interactive generator
          </p>
        </header>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Theme Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Theme Controls</CardTitle>
                <CardDescription>
                  Customize your theme colors and radius
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="light">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="light">Light</TabsTrigger>
                      <TabsTrigger value="dark">Dark</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPreviewMode("light")}
                        className={cn(
                          "h-8 w-8",
                          previewMode === "light" && "border-primary"
                        )}
                      >
                        <Sun className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPreviewMode("dark")}
                        className={cn(
                          "h-8 w-8",
                          previewMode === "dark" && "border-primary"
                        )}
                      >
                        <Moon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="light" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(lightTheme).map(([key, value]) => {
                        if (key === "radius") return null;
                        return (
                          <ColorPicker
                            key={key}
                            label={key}
                            color={value}
                            onChange={(color) =>
                              updateThemeColor("light", key, color)
                            }
                          />
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="dark" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(darkTheme).map(([key, value]) => {
                        if (key === "radius") return null;
                        return (
                          <ColorPicker
                            key={key}
                            label={key}
                            color={value}
                            onChange={(color) =>
                              updateThemeColor("dark", key, color)
                            }
                          />
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Border Radius</h3>
                  <RadiusSlider
                    value={Number.parseFloat(lightTheme.radius)}
                    onChange={(value) => updateRadius(`${value}rem`)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button onClick={copyToClipboard} className="w-full">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" /> Copy CSS Variables
                    </>
                  )}
                </Button>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={resetThemes}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          onClick={generateRandomTheme}
                          className="flex-1"
                        >
                          <Wand2 className="mr-2 h-4 w-4" /> Random Theme
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate a random theme with good contrast</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="pt-2 w-full">
                  <label className="text-sm font-medium mb-2 block">
                    Color Palette Style
                  </label>
                  <Select
                    value={paletteType}
                    onValueChange={(value) =>
                      setPaletteType(value as PaletteType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select palette type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monochromatic">
                        Monochromatic
                      </SelectItem>
                      <SelectItem value="analogous">Analogous</SelectItem>
                      <SelectItem value="complementary">
                        Complementary
                      </SelectItem>
                      <SelectItem value="triadic">Triadic</SelectItem>
                      <SelectItem value="tetradic">Tetradic</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="earthy">Earthy</SelectItem>
                      <SelectItem value="cool">Cool</SelectItem>
                      <SelectItem value="warm">Warm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>CSS Variables</CardTitle>
                <CardDescription>Copy these to your project</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-[300px]">
                  {generateCssVariables()}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your theme looks</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full justify-start border-b rounded-none px-6">
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="landing">Landing Page</TabsTrigger>
                  </TabsList>

                  <div
                    className={cn(
                      "transition-colors",
                      previewMode === "dark" ? "dark" : ""
                    )}
                  >
                    <TabsContent value="components" className="p-6 mt-0">
                      <ComponentPreview />
                    </TabsContent>

                    <TabsContent
                      value="landing"
                      className="p-6 mt-0 bg-background text-foreground"
                    >
                      <LandingPreview />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
