import SurveySingleItemView from '@/components/survey-renderer/SurveySingleItemView/SurveySingleItemView';
import React from 'react';
import { ComponentProperties, Expression, ExpressionArg, ItemComponent, ItemGroupComponent, LocalizedContent, SurveyItem, SurveySingleItem, isItemGroupComponent } from 'survey-engine/data_types';
import SurveyLanguageToggle from '../../../../general/SurveyLanguageToggle';
import { enUS as en, nl } from 'date-fns/locale';
import { SurveyContextProvider } from '@/components/survey-renderer/survey-context';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';



interface ItemPreviewProps {
    surveyItem: SurveyItem;
}

const dummyResolveItem = (item: SurveySingleItem, languageCode: string): SurveySingleItem => {
    const resolvedItem = { ...item };

    resolvedItem.components = resolveComponentGroup(resolvedItem, languageCode, resolvedItem.components as ItemGroupComponent, false);
    return resolvedItem;
}

const resolveComponentGroup = (parentItem: SurveySingleItem, languageCode: string, group?: ItemGroupComponent, rerender?: boolean): ItemGroupComponent => {
    if (!group) {
        return { role: '', items: [] }
    }

    if (!group.order || group.order.name === 'sequential') {
        if (!group.items) {
            console.warn(`this should not be a component group, items is missing or empty: ${parentItem.key} -> ${group.key}/${group.role} `);
            return {
                ...group,
                content: resolveContent(group.content, languageCode, group),
                displayCondition: undefined // group.displayCondition ? this.evalConditions(group.displayCondition as Expression, parentItem) : undefined,
            }
        }
        return {
            ...group,
            content: resolveContent(group.content, languageCode, group),
            displayCondition: undefined, // group.displayCondition ? this.evalConditions(group.displayCondition as Expression, parentItem) : undefined,
            items: group.items.map(comp => {
                if (isItemGroupComponent(comp)) {
                    return resolveComponentGroup(parentItem, languageCode, comp);
                }
                return {
                    ...comp,
                    disabled: undefined, // comp.disabled ? this.evalConditions(comp.disabled as Expression, parentItem) : undefined,
                    displayCondition: undefined, // comp.displayCondition ? this.evalConditions(comp.displayCondition as Expression, parentItem) : undefined,
                    content: resolveContent(comp.content, languageCode, comp),
                    properties: resolveComponentProperties(comp.properties),
                }
            }),
        }
    }
    if (rerender) {
        console.error('define how to deal with rerendering - order should not change');
    }
    console.error('order type not implemented: ', group.order.name);
    return {
        ...group
    }
}

const resolveContent = (contents: LocalizedContent[] | undefined, languageCode: string, component: ItemComponent): LocalizedContent[] | undefined => {
    if (!contents) { return; }

    const noTranslationFound = (key: string) => '< ' + languageCode + ' translation missing for ' + key + ' >';

    return contents.map(cont => {
        let resolvedContent: string;
        const translation = component.translations?.[languageCode];
        if (translation) {
            resolvedContent = translation[cont.key] || noTranslationFound(cont.key);
        } else {
            resolvedContent = noTranslationFound(cont.key);
        }

        if (cont.type === 'CQM') {
            console.log('handle preview for CQM');
        }

        return {
            type: cont.type,
            key: cont.key,
            resolvedText: resolvedContent
        }
    })
}

const resolveComponentProperties = (props: ComponentProperties | undefined): ComponentProperties | undefined => {
    if (!props) { return; }

    const resolvedProps = { ...props };
    if (resolvedProps.min) {
        const arg = expressionArgParser(resolvedProps.min as ExpressionArg);
        resolvedProps.min = isExpression(arg) ? undefined : arg as number;
    } if (resolvedProps.max) {
        const arg = expressionArgParser(resolvedProps.max as ExpressionArg);
        resolvedProps.max = isExpression(arg) ? undefined : arg as number;
    }
    if (resolvedProps.stepSize) {
        const arg = expressionArgParser(resolvedProps.stepSize as ExpressionArg);
        resolvedProps.stepSize = isExpression(arg) ? undefined : arg as number;
    }
    if (resolvedProps.dateInputMode) {
        const arg = expressionArgParser(resolvedProps.dateInputMode as ExpressionArg);
        resolvedProps.dateInputMode = isExpression(arg) ? 'exp' : arg as string;
    }
    return resolvedProps;
}

const isExpression = (value: unknown): value is Expression => {
    return typeof (value) === 'object' && (value as Expression).name !== undefined && (value as Expression).name.length > 0;
}

export const expressionArgParser = (arg: ExpressionArg): number | string | Expression => {
    switch (arg.dtype) {
        case 'num':
            return arg.num !== undefined ? arg.num : 0;
        case 'str':
            return arg.str || '';
        case 'exp':
            return arg.exp || {
                name: 'unknown',
                data: []
            };
        default:
            return arg.str || '';
    }
}

const ItemPreview: React.FC<ItemPreviewProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const renderedItem = dummyResolveItem(props.surveyItem as SurveySingleItem, selectedLanguage);

    const isSurveyEnd = renderedItem.type === 'surveyEnd';

    return (
        <div className='max-w-[832px] mx-auto py-4 space-y-4 survey'>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>

            <div className='border border-neutral-200 p-4 bg-white shadow-md rounded-sm @container'>
                <SurveyContextProvider
                    onRunExternalHandler={undefined}
                >
                    <SurveySingleItemView
                        renderItem={renderedItem}
                        languageCode={selectedLanguage}
                        responseChanged={() => { }}
                        invalidWarning={'invalid warning'}
                        showInvalid={false}
                        showKeys={false}
                        dateLocales={[{
                            code: 'en', locale: en, format: 'PPP'
                        }, {
                            code: 'nl', locale: nl, format: 'PPP'
                        }]}
                    />
                    {isSurveyEnd ? <div className='bg-[--survey-card-bg] px-[--survey-card-px-sm] @md:px-[--survey-card-px] py-2 @md:py-4 rounded-b-[--survey-card-border-radius]'>
                        <p>{'< Button to submit >'}</p>
                    </div> : null}


                </SurveyContextProvider>
            </div>
        </div>

    );
};

export default ItemPreview;
