import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComponentPreview from "@/components/component-preview";
import LandingPreview from "@/components/landing-preview";
import { cn } from "@/lib/utils";

interface PreviewAreaProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  previewMode: "light" | "dark" | "system";
}

export default function PreviewArea({
  activeTab,
  onTabChange,
  previewMode,
}: PreviewAreaProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Preview</CardTitle>
        <CardDescription>See how your theme looks</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-6">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="landing">Landing Page</TabsTrigger>
          </TabsList>

          {/* Apply dark class based on previewMode */}
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
              className="p-6 mt-0 bg-background text-foreground" // Ensure background for landing preview
            >
              <LandingPreview />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
