// Color theory utilities for theme generation

// Color harmony types
export type ColorHarmony =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "split-complementary"

// Convert hex to RGB
export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
    : [0, 0, 0]
}

// Convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

// Convert RGB to HSL
export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

// Convert HSL to RGB
export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

// Convert hex to HSL
export const hexToHsl = (hex: string): [number, number, number] => {
  const rgb = hexToRgb(hex)
  return rgbToHsl(rgb[0], rgb[1], rgb[2])
}

// Convert HSL to hex
export const hslToHex = (h: number, s: number, l: number): string => {
  const rgb = hslToRgb(h, s, l)
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

// Adjust color lightness
export const adjustLightness = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex)
  return hslToHex(h, s, Math.max(0, Math.min(100, l + amount)))
}

// Adjust color saturation
export const adjustSaturation = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex)
  return hslToHex(h, Math.max(0, Math.min(100, s + amount)), l)
}

// Generate harmonious colors based on color theory
export const generateHarmoniousColors = (baseColor: string, harmony: ColorHarmony, count = 5): string[] => {
  const [h, s, l] = hexToHsl(baseColor)
  const colors: string[] = [baseColor]

  switch (harmony) {
    case "monochromatic":
      // Vary lightness
      for (let i = 1; i < count; i++) {
        const newL = Math.max(0, Math.min(100, l + i * 15 - count * 7.5))
        colors.push(hslToHex(h, s, newL))
      }
      break

    case "analogous":
      // Adjacent hues on the color wheel (±30°)
      for (let i = 1; i < count; i++) {
        const newH = (h + i * 30 - count * 15 + 360) % 360
        colors.push(hslToHex(newH, s, l))
      }
      break

    case "complementary":
      // Opposite colors on the color wheel (180°)
      colors.push(hslToHex((h + 180) % 360, s, l))

      // Add variations
      if (count > 2) {
        colors.push(hslToHex(h, s, l - 20))
        colors.push(hslToHex((h + 180) % 360, s, l - 20))
      }
      if (count > 4) {
        colors.push(hslToHex(h, s - 20, l))
      }
      break

    case "triadic":
      // Three colors evenly spaced on the color wheel (120°)
      colors.push(hslToHex((h + 120) % 360, s, l))
      colors.push(hslToHex((h + 240) % 360, s, l))

      // Add variations
      if (count > 3) {
        colors.push(hslToHex(h, s, l - 20))
        colors.push(hslToHex((h + 120) % 360, s, l - 20))
      }
      break

    case "tetradic":
      // Four colors forming a rectangle on the color wheel
      colors.push(hslToHex((h + 90) % 360, s, l))
      colors.push(hslToHex((h + 180) % 360, s, l))
      colors.push(hslToHex((h + 270) % 360, s, l))

      // Add variation
      if (count > 4) {
        colors.push(hslToHex(h, s, l - 20))
      }
      break

    case "split-complementary":
      // Base color plus two colors adjacent to its complement
      colors.push(hslToHex((h + 150) % 360, s, l))
      colors.push(hslToHex((h + 210) % 360, s, l))

      // Add variations
      if (count > 3) {
        colors.push(hslToHex(h, s, l - 20))
        colors.push(hslToHex((h + 180) % 360, s, l - 20))
      }
      break
  }

  // Ensure we have exactly the requested number of colors
  while (colors.length < count) {
    const lastColor = colors[colors.length - 1]
    const [lastH, lastS, lastL] = hexToHsl(lastColor)
    colors.push(hslToHex(lastH, lastS, lastL - 10))
  }

  return colors.slice(0, count)
}

// Calculate contrast ratio between two colors
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex)
    const [r, g, b] = rgb.map((c) => {
      const channel = c / 255
      return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)

  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

// Ensure sufficient contrast between two colors
export const ensureContrast = (backgroundColor: string, textColor: string, minContrast = 4.5): string => {
  let adjustedColor = textColor
  let contrast = getContrastRatio(backgroundColor, adjustedColor)

  if (contrast >= minContrast) {
    return adjustedColor
  }

  const [h, s, l] = hexToHsl(textColor)
  const [bgH, bgS, bgL] = hexToHsl(backgroundColor)

  // Determine whether to lighten or darken based on background
  const shouldLighten = bgL < 50

  // Adjust lightness until we reach desired contrast
  let newL = l
  let step = shouldLighten ? 5 : -5
  let attempts = 0

  while (contrast < minContrast && attempts < 20) {
    newL = Math.max(0, Math.min(100, newL + step))
    adjustedColor = hslToHex(h, s, newL)
    contrast = getContrastRatio(backgroundColor, adjustedColor)
    attempts++

    // If we've gone too far, reduce step size
    if ((shouldLighten && newL >= 100) || (!shouldLighten && newL <= 0)) {
      step = step / 2
    }
  }

  return adjustedColor
}

