import React from "react";
import {GeneratedColor, PaletteType} from "@/types/palette";
import {generatePalette} from "@/lib/utils";


export function usePalette(baseColor: string, type: PaletteType) {
    const [colors, setColors] = React.useState<GeneratedColor[]>([]);

    React.useEffect(() => {
        if (baseColor != "#3498db"){
            const newColors = generatePalette(baseColor, type);
            setColors(newColors);
            localStorage.setItem("colors", JSON.stringify(newColors));
        }

    }, [baseColor, type]);

    React.useEffect(() => {
        const stored = localStorage.getItem("colors");
        if (stored) {
            try {
                setColors(JSON.parse(stored));
            } catch (e) {
                console.warn("Не удалось загрузить палитру из localStorage", e);
            }
        }
    }, []);

    const regenerate = () => {
        let prevColors = colors;
        if (!prevColors.length){
            prevColors = generatePalette(baseColor, type);
        }
        const newColors = generatePalette(baseColor, type, prevColors);
        setColors(newColors);
        localStorage.setItem("colors", JSON.stringify(newColors));
    };

    const toggleBlock = (index: number) => {
        setColors(prev =>
            prev.map((color, i) =>
                i === index ? { ...color, isBlocked: !color.isBlocked } : color
            )
        );
    };

    return { colors, regenerate, toggleBlock };
}
