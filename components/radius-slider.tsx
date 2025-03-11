"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"

interface RadiusSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function RadiusSlider({ value, onChange }: RadiusSliderProps) {
  const [sliderValue, setSliderValue] = useState(value)

  useEffect(() => {
    setSliderValue(value)
  }, [value])

  const handleChange = (values: number[]) => {
    const newValue = values[0]
    setSliderValue(newValue)
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Border Radius: {sliderValue.toFixed(2)}rem</span>
      </div>
      <Slider value={[sliderValue]} min={0} max={2} step={0.05} onValueChange={handleChange} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Square</span>
        <span>Rounded</span>
        <span>Pill</span>
      </div>
      <div className="flex justify-between gap-4 pt-2">
        <div className="w-12 h-12 border bg-card" style={{ borderRadius: `${sliderValue}rem` }} />
        <div
          className="flex-1 h-10 border bg-primary text-primary-foreground flex items-center justify-center"
          style={{ borderRadius: `${sliderValue}rem` }}
        >
          Button
        </div>
        <div className="w-12 h-12 border bg-card" style={{ borderRadius: `${sliderValue}rem` }} />
      </div>
    </div>
  )
}

