import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaveThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  themeName: string;
  onThemeNameChange: (name: string) => void;
  onSave: () => void;
  defaultNamePlaceholder: string;
}

export default function SaveThemeDialog({
  isOpen,
  onOpenChange,
  themeName,
  onThemeNameChange,
  onSave,
  defaultNamePlaceholder,
}: SaveThemeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Theme</DialogTitle>
          <DialogDescription>
            Enter a name for your new theme configuration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme-name" className="text-right">
              Name
            </Label>
            <Input
              id="theme-name"
              value={themeName}
              onChange={(e) => onThemeNameChange(e.target.value)}
              className="col-span-3"
              placeholder={defaultNamePlaceholder}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={onSave}>
            Save Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
