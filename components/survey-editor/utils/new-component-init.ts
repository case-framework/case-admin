import { ItemComponent, LocalizedContent, LocalizedContentType } from "survey-engine";

export const initNewTextComponent = (
    key: string | undefined,
    role: string,
    contents: LocalizedContent[] = [],
): ItemComponent => {
    const newComponent: ItemComponent = {
        key: key,
        role: role,
        content: contents,
        translations: {}
    }

    return newComponent;
}
