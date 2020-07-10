type Translations = {
    one: string;
    some: string;
    many: string;
};

export const getTranslationByDeclension = (translations: Translations, count: number): any => {
    if (count < 0) return null;
    if (count === 0) return translations.one;
    if (count > 1 && count < 5) return translations.some;
    if (count === 1 || (count > 4 && count < 21)) return translations.many;
    return getTranslationByDeclension(translations, count % 10);
};
