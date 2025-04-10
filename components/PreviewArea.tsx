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
import DashboardPreview from "@/components/DashboardPreview"; // Import new preview
import BlogPreview from "@/components/BlogPreview"; // Import new preview
import { cn } from "@/lib/utils";
import AuthenticationPreview from "./AuthenticationPreview";

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
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>{" "}
            <TabsTrigger value="authentication">Authentication</TabsTrigger>{" "}
            {/* New Tab */}
            <TabsTrigger value="blog">Blog</TabsTrigger> {/* New Tab */}
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
              className="p-6 mt-0 bg-background text-foreground"
            >
              <LandingPreview />
            </TabsContent>

            <TabsContent
              value="dashboard"
              className="p-6 mt-0 bg-background text-foreground"
            >
              <DashboardPreview />
            </TabsContent>
            <TabsContent
              value="authentication"
              className="p-6 mt-0 bg-background text-foreground"
            >
              <AuthenticationPreview />
            </TabsContent>

            <TabsContent
              value="blog"
              className="p-6 mt-0 bg-background text-foreground"
            >
              <BlogPreview />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
