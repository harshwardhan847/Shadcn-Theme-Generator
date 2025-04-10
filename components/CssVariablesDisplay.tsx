import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CssVariablesDisplayProps {
  cssVariables: string;
}

export default function CssVariablesDisplay({
  cssVariables,
}: CssVariablesDisplayProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>CSS Variables</CardTitle>
        <CardDescription>Copy these to your project</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-[300px]">
          {cssVariables}
        </pre>
      </CardContent>
    </Card>
  );
}
