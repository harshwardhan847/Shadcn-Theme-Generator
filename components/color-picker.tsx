"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

export default function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(color)

  // Format label for display
  const formatLabel = (str: string) => {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }

  // Update input value when color changes
  useEffect(() => {
    setInputValue(color)
  }, [color])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Only update if it's a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      onChange(value)
    }
  }

  // Handle blur event to ensure valid color
  const handleBlur = () => {
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(inputValue)) {
      setInputValue(color)
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={`color-${label}`} className="text-xs">
        {formatLabel(label)}
      </Label>
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-8 h-8 p-0 border"
              style={{ backgroundColor: color }}
              aria-label={`Pick color for ${label}`}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start" side="right">
            <HexColorPicker color={color} onChange={onChange} />
          </PopoverContent>
        </Popover>
        <Input
          id={`color-${label}`}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="h-8 text-xs"
        />
      </div>
    </div>
  )
}

