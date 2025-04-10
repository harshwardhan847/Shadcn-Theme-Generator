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
import type { SavedTheme } from "./theme-generator"; // Adjust path

interface DeleteThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  themeToDelete: SavedTheme | null;
  onConfirmDelete: () => void;
  onCancel: () => void; // Optional: To reset themeToDelete state if needed on cancel
}

export default function DeleteThemeDialog({
  isOpen,
  onOpenChange,
  themeToDelete,
  onConfirmDelete,
  onCancel,
}: DeleteThemeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Theme</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the theme{" "}
            <strong>"{themeToDelete?.name}"</strong>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
