import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Copy, Moon, Sun, Wand2, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ColorPicker from "@/components/color-picker";
import RadiusSlider from "@/components/radius-slider";
import { cn } from "@/lib/utils";
import { PaletteType } from "./theme-generator"; // Adjust path
import { defaultLightTheme } from "./default-themes";

type Theme = typeof defaultLightTheme;

interface ThemeControlsProps {
  lightTheme: Theme;
  darkTheme: Theme;
  previewMode: "light" | "dark" | "system";
  paletteType: PaletteType;
  copied: boolean;
  onUpdateColor: (
    themeType: "light" | "dark",
    key: string,
    value: string
  ) => void;
  onUpdateRadius: (value: string) => void;
  onPreviewModeChange: (mode: "light" | "dark") => void;
  onPaletteTypeChange: (type: PaletteType) => void;
  onCopy: () => void;
  onReset: () => void;
  onRandom: () => void;
  onPrepareSave: () => void; // Function to open the save dialog
}

export default function ThemeControls({
  lightTheme,
  darkTheme,
  previewMode,
  paletteType,
  copied,
  onUpdateColor,
  onUpdateRadius,
  onPreviewModeChange,
  onPaletteTypeChange,
  onCopy,
  onReset,
  onRandom,
  onPrepareSave,
}: ThemeControlsProps) {
  return (
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
                onClick={() => onPreviewModeChange("light")}
                className={cn(
                  "h-8 w-8",
                  previewMode === "light" && "border-primary"
                )}
                title="Preview Light Mode"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPreviewModeChange("dark")}
                className={cn(
                  "h-8 w-8",
                  previewMode === "dark" && "border-primary"
                )}
                title="Preview Dark Mode"
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
                    key={`light-${key}`}
                    label={key}
                    color={value}
                    onChange={(color) => onUpdateColor("light", key, color)}
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
                    key={`dark-${key}`}
                    label={key}
                    color={value}
                    onChange={(color) => onUpdateColor("dark", key, color)}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-3">Border Radius</h3>
          <RadiusSlider
            value={Number.parseFloat(lightTheme.radius as string)}
            onChange={(value) => onUpdateRadius(`${value}rem`)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={onCopy} className="w-full">
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
          {/* Save button now triggers the dialog via prop */}
          <Button variant="outline" onClick={onPrepareSave} className="flex-1">
            <Save className="mr-2 h-4 w-4" /> Save Theme
          </Button>
          <Button variant="outline" onClick={onReset} className="flex-1">
            Reset
          </Button>
        </div>
        <div className="flex gap-2 w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={onRandom}
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
            onValueChange={(value) => onPaletteTypeChange(value as PaletteType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select palette type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monochromatic">Monochromatic</SelectItem>
              <SelectItem value="analogous">Analogous</SelectItem>
              <SelectItem value="complementary">Complementary</SelectItem>
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
  );
}
