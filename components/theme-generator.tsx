"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";

// Import your new components
import SavedThemesList from "./SavedThemesList";
import ThemeControls from "./ThemeControls";
import CssVariablesDisplay from "./CssVariablesDisplay";
import PreviewArea from "./PreviewArea";
import SaveThemeDialog from "./SaveThemeDialog";
import DeleteThemeDialog from "./DeleteThemeDialog";

// Import defaults and utils
import { defaultLightTheme, defaultDarkTheme } from "./default-themes";
import {
  adjustLightness,
  adjustSaturation,
  randomColor,
  ensureContrast,
  generatePalette,
  convertHexToHSLString, // Renamed import
  kebabCase,
  createBackgroundVariations,
} from "./color-utils";

// --- Keep existing types ---
export type PaletteType =
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

export interface SavedTheme {
  name: string;
  light: typeof defaultLightTheme;
  dark: typeof defaultDarkTheme;
  timestamp: number;
}
// --- End Types ---

export default function ThemeGenerator() {
  // --- State remains the same ---
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("components");
  const [lightTheme, setLightTheme] = useState(defaultLightTheme); // Uses imported default
  const [darkTheme, setDarkTheme] = useState(defaultDarkTheme); // Uses imported default
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"light" | "dark" | "system">(
    "system"
  );
  const [paletteType, setPaletteType] = useState<PaletteType>("complementary");
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<SavedTheme | null>(null);

  // --- useEffect hooks remain the same, but ensure they use imported functions ---
  useEffect(() => {
    try {
      const storedThemes = localStorage.getItem("shadcnSavedThemes");
      if (storedThemes) {
        setSavedThemes(JSON.parse(storedThemes));
      }
    } catch (error) {
      console.error("Failed to load themes from local storage:", error);
      toast.error("Could not load saved themes from local storage.");
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("shadcnSavedThemes", JSON.stringify(savedThemes));
    } catch (error) {
      console.error("Failed to save themes to local storage:", error);
      toast.error(
        "Could not save themes to local storage. Storage might be full."
      );
    }
  }, [savedThemes]);

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(lightTheme).forEach(([key, value]) => {
      if (key === "radius") {
        root.style.setProperty("--radius", value);
        return;
      }
      const hslValue = convertHexToHSLString(value);
      if (hslValue) {
        root.style.setProperty(`--${kebabCase(key)}`, hslValue);
      }
    });

    const darkStyles = Object.entries(darkTheme)
      .filter(([key]) => key !== "radius")
      .map(([key, value]) => {
        const hslValue = convertHexToHSLString(value);
        return `--${kebabCase(key)}: ${hslValue};`;
      })
      .join("\n");

    let darkStyleElement = document.getElementById("dark-theme-vars");
    if (!darkStyleElement) {
      darkStyleElement = document.createElement("style");
      darkStyleElement.id = "dark-theme-vars";
      document.head.appendChild(darkStyleElement);
    }
    darkStyleElement.textContent = `.dark {\n${darkStyles}\n}`;
  }, [lightTheme, darkTheme]);

  // --- Core logic functions remain the same, ensure they use imported utils ---
  const updateThemeColor = useCallback(
    (themeType: "light" | "dark", key: string, value: string) => {
      if (themeType === "light") {
        setLightTheme((prev) => ({ ...prev, [key]: value }));
      } else {
        setDarkTheme((prev) => ({ ...prev, [key]: value }));
      }
    },
    []
  );

  const updateRadius = useCallback((value: string) => {
    setLightTheme((prev) => ({ ...prev, radius: value }));
    setDarkTheme((prev) => ({ ...prev, radius: value }));
  }, []);

  const generateCssVariables = useCallback(() => {
    const lightVars = Object.entries(lightTheme)
      .map(([key, value]) => {
        if (key === "radius") {
          return `  --radius: ${value};`;
        }
        const hslValue = convertHexToHSLString(value);
        return `  --${kebabCase(key)}: ${hslValue};`;
      })
      .join("\n");

    const darkVars = Object.entries(darkTheme)
      .map(([key, value]) => {
        if (key === "radius") return "";
        const hslValue = convertHexToHSLString(value);
        return `  --${kebabCase(key)}: ${hslValue};`;
      })
      .filter(Boolean)
      .join("\n");

    return `:root {\n${lightVars}\n}\n\n.dark {\n${darkVars}\n}`;
  }, [lightTheme, darkTheme]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generateCssVariables());
    setCopied(true);
    toast.success("CSS Variables copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [generateCssVariables]);

  const resetThemes = useCallback(() => {
    setLightTheme(defaultLightTheme);
    setDarkTheme(defaultDarkTheme);
    toast.info("Theme reset to defaults.");
  }, []);

  const generateRandomTheme = useCallback(() => {
    const baseColor = randomColor();
    const palette = generatePalette(baseColor, paletteType);

    const lightBg = "#ffffff";
    const lightFg = "#09090b";

    const darkBg = "#09090b";
    const darkFg = "#fafafa";

    const lightBackgrounds = createBackgroundVariations(lightBg, false);
    const darkBackgrounds = createBackgroundVariations(darkBg, true);

    const newLightTheme = {
      background: lightBackgrounds.background,
      foreground: lightFg,
      card: lightBackgrounds.card,
      cardForeground: lightFg,
      popover: lightBackgrounds.popover,
      popoverForeground: lightFg,
      primary: palette[0],
      primaryForeground: ensureContrast(palette[0], darkFg),
      secondary: adjustLightness(palette[1], 30),
      secondaryForeground: ensureContrast(
        adjustLightness(palette[1], 30),
        lightFg
      ),
      muted: adjustSaturation(adjustLightness(palette[1], 35), -30),
      mutedForeground: ensureContrast(
        adjustSaturation(adjustLightness(palette[1], 35), -30),
        "#71717a",
        3
      ),
      accent: adjustLightness(palette[2], 30),
      accentForeground: ensureContrast(
        adjustLightness(palette[2], 30),
        lightFg
      ),
      destructive: "#ef4444",
      destructiveForeground: darkFg,
      border: lightBackgrounds.border,
      input: lightBackgrounds.input,
      ring: adjustLightness(palette[0], 20),
      radius: lightTheme.radius,
    };

    const newDarkTheme = {
      background: darkBackgrounds.background,
      foreground: darkFg,
      card: darkBackgrounds.card,
      cardForeground: darkFg,
      popover: darkBackgrounds.popover,
      popoverForeground: darkFg,
      primary: adjustLightness(palette[0], 20),
      primaryForeground: ensureContrast(
        adjustLightness(palette[0], 20),
        lightFg
      ),
      secondary: adjustLightness(palette[1], -30),
      secondaryForeground: ensureContrast(
        adjustLightness(palette[1], -30),
        darkFg
      ),
      muted: adjustLightness(palette[1], -40),
      mutedForeground: ensureContrast(
        adjustLightness(palette[1], -40),
        "#a1a1aa",
        3
      ),
      accent: adjustLightness(palette[2], -30),
      accentForeground: ensureContrast(
        adjustLightness(palette[2], -30),
        darkFg
      ),
      destructive: "#7f1d1d",
      destructiveForeground: "#ef4444",
      border: darkBackgrounds.border,
      input: darkBackgrounds.input,
      ring: adjustLightness(palette[0], -20),
      radius: darkTheme.radius,
    };

    setLightTheme(newLightTheme);
    setDarkTheme(newDarkTheme);
    toast.success("Generated a random theme!");
  }, [paletteType, lightTheme.radius, darkTheme.radius]);

  const handleSaveTheme = useCallback(() => {
    const themeName = newThemeName.trim();
    if (themeName) {
      const newSavedTheme: SavedTheme = {
        name: themeName,
        light: { ...lightTheme },
        dark: { ...darkTheme },
        timestamp: Date.now(),
      };
      setSavedThemes((prev) => [...prev, newSavedTheme]);
      toast.success(`Theme "${newSavedTheme.name}" saved!`);
      setIsSaveDialogOpen(false);
      setNewThemeName("");
    } else {
      toast.error("Theme name cannot be empty.");
    }
  }, [newThemeName, lightTheme, darkTheme]);

  const prepareSaveDialog = useCallback(() => {
    setNewThemeName(`Theme ${savedThemes.length + 1}`);
    setIsSaveDialogOpen(true);
  }, [savedThemes.length]);

  const applySavedTheme = useCallback((themeToApply: SavedTheme) => {
    setLightTheme(themeToApply.light);
    setDarkTheme(themeToApply.dark);
    toast.info(`Applied theme: "${themeToApply.name}"`);
  }, []);

  const prepareDeleteDialog = useCallback((theme: SavedTheme) => {
    setThemeToDelete(theme);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (themeToDelete) {
      setSavedThemes((prev) =>
        prev.filter((theme) => theme.timestamp !== themeToDelete.timestamp)
      );
      toast.success(`Theme "${themeToDelete.name}" deleted.`);
      setThemeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }, [themeToDelete]);

  const handleCancelDelete = useCallback(() => {
    setThemeToDelete(null);
    setIsDeleteDialogOpen(false);
  }, []);

  const handlePreviewModeChange = useCallback((mode: "light" | "dark") => {
    setPreviewMode(mode);
  }, []);

  return (
    <div
      className={cn(
        "transition-colors w-full min-h-screen bg-background text-foreground"
      )}
    >
      <div className="container mx-auto py-6 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Shadcn UI Theme Generator</h1>
          <p className="text-muted-foreground">
            Customize your theme with this interactive generator
          </p>
        </header>

        <SavedThemesList
          savedThemes={savedThemes}
          onApplyTheme={applySavedTheme}
          onPrepareDelete={prepareDeleteDialog}
        />

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-4">
            <ThemeControls
              lightTheme={lightTheme}
              darkTheme={darkTheme}
              previewMode={previewMode}
              paletteType={paletteType}
              copied={copied}
              onUpdateColor={updateThemeColor}
              onUpdateRadius={updateRadius}
              onPreviewModeChange={handlePreviewModeChange}
              onPaletteTypeChange={setPaletteType}
              onCopy={copyToClipboard}
              onReset={resetThemes}
              onRandom={generateRandomTheme}
              onPrepareSave={prepareSaveDialog}
            />
            <CssVariablesDisplay cssVariables={generateCssVariables()} />
          </div>

          <PreviewArea
            activeTab={activeTab}
            onTabChange={setActiveTab}
            previewMode={previewMode}
          />
        </div>
      </div>

      <SaveThemeDialog
        isOpen={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        themeName={newThemeName}
        onThemeNameChange={setNewThemeName}
        onSave={handleSaveTheme}
        defaultNamePlaceholder={`Theme ${savedThemes.length + 1}`}
      />

      <DeleteThemeDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        themeToDelete={themeToDelete}
        onConfirmDelete={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}
