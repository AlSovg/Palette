import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import chroma from "chroma-js";
import {GeneratedColor, PaletteType} from "@/types/palette";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generatePalette(
    baseColor: string,
    type: PaletteType,
    prevColors: GeneratedColor[] = []
): GeneratedColor[] {
  const newColors = (() => {
    try {
      switch (type) {
        case 'analogous':
          return chroma.scale([baseColor, chroma(baseColor).set('hsl.h', '+60').hex()]).mode('lch').colors(5)

        case 'complementary':
          return [
            baseColor,
            chroma(baseColor).set('hsl.h', (chroma(baseColor).get('hsl.h') + 180) % 360).hex(),
            chroma(baseColor).set('hsl.h', '+30').hex(),
            chroma(baseColor).set('hsl.h', '-30').hex(),
            chroma(baseColor).set('hsl.h', '+90').hex(),
          ];

        case 'triadic':
          return [
            baseColor,
            chroma(baseColor).set('hsl.h', (chroma(baseColor).get('hsl.h') + 120) % 360).hex(),
            chroma(baseColor).set('hsl.h', (chroma(baseColor).get('hsl.h') + 240) % 360).hex(),
            chroma(baseColor).set('hsl.l', '*0.8').hex(),
            chroma(baseColor).set('hsl.l', '*1.2').hex(),
          ];

        case 'monochromatic':
          return chroma
              .scale([chroma(baseColor).brighten(2), baseColor, chroma(baseColor).darken(2)])
              .mode('lab')
              .colors(5);

        default:
          return [baseColor];
      }
    } catch {
      return [baseColor];
    }
  })();

  return newColors.map((color : string, index : number) => {
    return ({
      color: prevColors[index]?.isBlocked ? prevColors[index].color : color,
      isBlocked: prevColors[index]?.isBlocked ?? false,
    });
  });
}