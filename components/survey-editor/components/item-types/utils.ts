import { ItemComponent, ItemGroupComponent, LocalizedString, SurveySingleItem, ExpressionArg } from 'survey-engine/data_types';
import { DateDisplayComponentProp, ExpressionDisplayProp, GenericQuestionProps, StyledTextComponentProp } from 'case-editor-tools/surveys/types';


export const localisedStringToMap = (loc?: LocalizedString[]): Map<string, string> => {
    const map = new Map<string, string>();
    if (!loc) return map;
    loc.forEach((item) => {
        map.set(item.code, item.parts.map(p => (p as ExpressionArg).str).join(''));
    });
    return map;
}

export const parseAdvancedContentProps = (items: ItemComponent[]): Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp> => {
    return items.map((i: any) => {
        const className = i.style?.find((s: any) => s.key === 'className')?.value;
        if (i.content === undefined
            || i.content.length === 0
            || i.content[0].parts === undefined
            || i.content[0].parts.length === 0
        ) {
            return {
                className: className,
                content: new Map([]),
            }
        }

        if (i.role === 'text') {
            // check if expression
            if (i.content[0].parts[0].dtype === 'exp') {
                return {
                    className: className,
                    expression: i.content[0].parts[0].exp,
                    languageCodes: i.content.map((c: any) => c.code),
                }
            }
            // if not, then assume simple formatted text
            return {
                className: className,
                content: localisedStringToMap(i.content as LocalizedString[])
            }
        } else if (i.role === 'dateDisplay') {
            return {
                className: className,
                date: i.content[0].parts[0].exp,
                dateFormat: i.style?.find((s: any) => s.key === 'dateFormat')?.value,
                languageCodes: i.content.map((c: any) => c.code),
            }
        }
        return i;
    });
}

export const surveyItemToGenericProps = (surveyItem: SurveySingleItem): GenericQuestionProps => {
    const keyParts = surveyItem.key.split('.');
    const itemKey = keyParts.pop() || '';
    const parentKey = keyParts.join('.');

    let questionText: Map<string, string> | Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp> = new Map([]);
    const titleComp = surveyItem.components?.items.find(i => i.role === 'title');
    if (titleComp) {
        if ((titleComp as ItemGroupComponent).items !== undefined) {
            // map items to styled text components and date display components
            questionText = parseAdvancedContentProps((titleComp as ItemGroupComponent).items)
        } else {
            questionText = localisedStringToMap(titleComp.content as LocalizedString[]);
        }
    }

    const subTitle = localisedStringToMap(titleComp?.description as LocalizedString[]);
    const titleClassName = titleComp?.style?.find(s => s.key === 'className')?.value;

    const helpgroup = (surveyItem.components?.items.find(i => i.role === 'helpGroup') as ItemGroupComponent)?.items?.map((i: any) => {
        return {
            content: localisedStringToMap(i.content as LocalizedString[]),
            style: i.style,
        }
    });

    const footNoteComp = surveyItem.components?.items.find(i => i.role === 'footnote')

    const responseGroupIndex = surveyItem.components?.items.findIndex(i => i.role === 'responseGroup') || 0;

    let topDisplayCompoments: ItemComponent[] | undefined = [];
    let bottomDisplayCompoments: ItemComponent[] | undefined = [];
    const ignoreRoles = ['responseGroup', 'title', 'helpGroup', 'footnote'];
    surveyItem.components?.items.forEach((comp, index) => {
        if (ignoreRoles.includes(comp.role)) {
            return;
        }
        if (index < responseGroupIndex) {
            topDisplayCompoments?.push(comp);
        }
        if (index > responseGroupIndex) {
            bottomDisplayCompoments?.push(comp);
        }
    });

    if (topDisplayCompoments.length === 0) {
        topDisplayCompoments = undefined;
    }
    if (bottomDisplayCompoments.length === 0) {
        bottomDisplayCompoments = undefined;
    }

    const indexOfSimpleRequiredValidation = surveyItem.validations ? surveyItem.validations?.findIndex(v => ['r', 'r1'].includes(v.key)) : -1
    const isRequired = indexOfSimpleRequiredValidation > -1;
    const customValidations = surveyItem.validations?.filter((v, index) => index !== indexOfSimpleRequiredValidation);

    const itemProps: GenericQuestionProps = {
        parentKey: parentKey,
        itemKey: itemKey,
        questionText: questionText,
        questionSubText: subTitle,
        titleClassName: titleClassName,
        helpGroupContent: helpgroup,
        footnoteText: footNoteComp ? localisedStringToMap(footNoteComp.content as LocalizedString[]) : undefined,
        topDisplayCompoments: topDisplayCompoments,
        bottomDisplayCompoments: bottomDisplayCompoments,
        condition: surveyItem.condition,
        metadata: surveyItem.metadata,
        confidentialMode: surveyItem.confidentialMode,
        customValidations: customValidations,
        isRequired: isRequired,
    };

    return itemProps;
}
