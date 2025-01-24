import {baseFileLanguageData} from "./baseFileLanguageData.js";

/**
 * Az alap nyelvi fájl alapján előállítja a nyelvi elemek listáját
 */
export const getBaseLanguageData = () => {
    const baseData = baseFileLanguageData();
    return baseData.map((unitData) => {
        return {
            status: 'NOT_PROCESSED',
            key: unitData.id,
            summary: unitData.id,
            components: [],
            ru: '',
            ro: '',
            zn: '',
            tr: '',
            hu: '',
            en: unitData.source,
            de: '',
            description: ''
        }
    });
}