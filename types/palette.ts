export type PaletteType = 'analogous' | 'complementary' | 'triadic' | 'monochromatic';

export const paletteTypeLabels: Record<PaletteType, string> = {
    analogous: 'Аналогичная',
    complementary: 'Дополнительная',
    triadic: 'Триадическая',
    monochromatic: 'Монохроматическая',
};

export type GeneratedColor = {
    color: string;
    isBlocked: boolean;
};