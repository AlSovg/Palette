import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import chroma from "chroma-js";
import {GeneratedColor, PaletteType} from "@/types/palette";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function addColorVariation(hex: string, variationStrength: number) {
    const color = chroma(hex);
    const h = color.get("hsl.h");
    const s = color.get("hsl.s");
    const l = color.get("hsl.l");

    return chroma.hsl(
        (h + (Math.random() - 0.5) * 360 * variationStrength) % 360,
        Math.min(Math.max(s + (Math.random() - 0.5) * variationStrength, 0), 1),
        Math.min(Math.max(l + (Math.random() - 0.5) * variationStrength, 0), 1)
    ).hex();
}


export function generatePalette(
    baseColor: string,
    type: PaletteType,
    prev?: GeneratedColor[]
): GeneratedColor[] {
    console.log(!!prev)
    return prev
        ? prev.map((color) => {
            const wasBlocked = color.isBlocked;
            const oldColor = color.color;
            return {
                color: wasBlocked ? oldColor : addColorVariation(color.color, 0.05),
                isBlocked: wasBlocked
            };
        })
        : calculateColors(baseColor, type).map(color => ({
            color,
            isBlocked: false
        }));

}


export function calculateColors(baseColor: string, type: PaletteType): string[] {
    try {
        switch (type) {
            case "analogous":
                return chroma.scale([
                    chroma(baseColor).set('hsl.h', '+30'),
                    baseColor,
                    chroma(baseColor).set('hsl.h', '-30')
                ])
                    .mode("lch")
                    .colors(5);

            case "complementary":
                return [
                    baseColor,
                    chroma(baseColor).set("hsl.h", (chroma(baseColor).get("hsl.h") + 180) % 360).hex(),
                    chroma(baseColor).set("hsl.h", "+30").hex(),
                    chroma(baseColor).set("hsl.h", "-30").hex(),
                    chroma(baseColor).set("hsl.h", "+90").hex(),
                ];

            case "triadic":
                return [
                    baseColor,
                    chroma(baseColor).set("hsl.h", (chroma(baseColor).get("hsl.h") + 120) % 360).hex(),
                    chroma(baseColor).set("hsl.h", (chroma(baseColor).get("hsl.h") + 240) % 360).hex(),
                    chroma(baseColor).set("hsl.l", "*0.8").hex(),
                    chroma(baseColor).set("hsl.l", "*1.2").hex(),
                ];

            case "monochromatic":
                return chroma
                    .scale([
                        chroma(baseColor).brighten(2),
                        baseColor,
                        chroma(baseColor).darken(2)
                    ])
                    .mode("lab")
                    .colors(5);

            default:
                return [baseColor];
        }
    } catch (error) {
        console.warn("Ошибка при генерации палитры:", error);
        return [baseColor];
    }
}
