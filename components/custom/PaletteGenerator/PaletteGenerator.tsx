"use client"
import React from "react";
import styles from "./PaletteGenerator.module.scss";
import {Button} from "@/components/ui/button";
import {LockOpen, Lock} from 'lucide-react';
import {toast} from "sonner"
import { PaletteType, paletteTypeLabels} from "@/types/palette";
import {usePalette} from "@/hooks/usePalette";

export const PaletteGenerator: React.FC = () => {
    const [baseColor, setBaseColor] = React.useState('#3498db');
    const [type, setType] = React.useState<PaletteType>('analogous');
    const [showWarning, setShowWarning] = React.useState(false);
    const { colors, regenerate, toggleBlock } = usePalette(baseColor, type);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                regenerate();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [regenerate]);



    return (
        <div className={styles.container}>
            <h1 className={styles.container__header}>Генератор цветовой палитры</h1>
            <div className={styles.infoTextWrapper}>
                <div className={`${styles.infoText} ${showWarning ? styles.hide : ''}`}>
                    Смените базовые параметры цвета или типа палитры.
                </div>
                <div className={`${styles.warning} ${showWarning ? '' : styles.hide}`}>
                    Изменение цвета или типа палитры сбросит блокировку цветов!
                </div>
            </div>
            <div
                onMouseEnter={() => setShowWarning(true)}
                onMouseLeave={() => setShowWarning(false)}
                className={styles.container__picker}>
                <label className={styles.container__label}>
                    Цвет:
                    <input
                        className={styles.container__color}
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                    />
                </label>

                <label className={styles.container__label}>
                    Тип:
                    <select
                        className={styles.container__select}
                        value={type}
                        onChange={(e) => setType(e.target.value as PaletteType)}
                    >
                        {Object.entries(paletteTypeLabels).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className={styles.container__palette}>
                {colors.map((col, idx) => (
                    <div
                        key={idx}
                        className={styles.container__colorBox}
                        style={{backgroundColor: col.color}}
                        onClick={() => {
                            navigator.clipboard.writeText(col.color).then();
                            toast(`Цвет ${col.color} скопирован!`, {
                                style: {borderColor: col.color, borderWidth: 3},
                                action: {
                                    label: "Скрыть",
                                    onClick: () => console.log("Скрыто"),
                                },
                            })
                        }}
                    >
                        <span>{col.color}</span>
                        <Button
                            className={styles.blockBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleBlock(idx)
                            }}
                        >
                            {col.isBlocked ? (<Lock className={styles.blockBtn__icon} width={70}
                                                    height={70}/>) : (
                                <LockOpen className={styles.blockBtn__icon} width={70} height={70}/>
                            )}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
        ;
};
