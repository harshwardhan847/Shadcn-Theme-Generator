import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import type { SavedTheme } from "./theme-generator"; // Adjust path if needed

interface SavedThemesListProps {
  savedThemes: SavedTheme[];
  onApplyTheme: (theme: SavedTheme) => void;
  onPrepareDelete: (theme: SavedTheme) => void;
}

export default function SavedThemesList({
  savedThemes,
  onApplyTheme,
  onPrepareDelete,
}: SavedThemesListProps) {
  if (savedThemes.length === 0) {
    return null; // Don't render if no themes are saved
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Saved Themes</CardTitle>
        <CardDescription>Click to apply a saved theme.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {savedThemes.map((saved) => (
          <div
            key={saved.timestamp}
            className="flex items-center gap-1 border rounded-md p-1 bg-card hover:shadow-sm transition-shadow"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onApplyTheme(saved)}
              className="flex-grow text-left justify-start h-auto py-1 px-2"
              title={`Apply theme: ${saved.name}`}
            >
              <span className="truncate max-w-[150px]">{saved.name}</span>
              <div className="flex gap-1 ml-2 flex-shrink-0">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: saved.light.primary }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: saved.dark.primary }}
                ></div>
              </div>
            </Button>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => onPrepareDelete(saved)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete theme: {saved.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
