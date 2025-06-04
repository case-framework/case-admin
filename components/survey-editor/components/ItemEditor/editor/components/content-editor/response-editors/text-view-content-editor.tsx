import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React from 'react';
import { ItemComponent, ItemGroupComponent } from 'survey-engine/data_types';
import FormattedTextListEditor from '../formatted-text-list-editor';
import { Textarea } from '@/components/ui/textarea';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';

interface TextViewContentEditorProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
    hideToggle?: boolean;
    // only works in simple mode
    hideStyling?: boolean;
    useAdvancedMode?: boolean;
    label?: string;
}

const determineAdvancedMode = (component: ItemComponent) => {
    return (component as ItemGroupComponent).items !== undefined && (component as ItemGroupComponent).content === undefined;
}

interface SimpleTextViewContentEditorProps {
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
    hideStyling?: boolean;
    label?: string;
    hideLabel?: boolean;
    useTextArea?: boolean;
    placeholder?: string;
}

export const SimpleTextViewContentEditor: React.FC<SimpleTextViewContentEditorProps> = ({
    component,
    onChange,
    hideStyling = true,
    label = 'Content',
    hideLabel,
    useTextArea: big = false,
    placeholder = 'Enter content here for the selected language...',
}) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const classNameIndex = component.style?.findIndex(style => style.key === 'className');
    const className = (component.style !== undefined && classNameIndex !== undefined && classNameIndex > -1) ? component.style[classNameIndex].value : '';
    const contentMap = localisedObjectToMap(component.content);

    return <div data-no-dnd="true">
        <div className='space-y-1.5'>
            {hideLabel ? null : <Label
                htmlFor={component.key}
            >
                {label}
            </Label>}
            {big ? <Textarea
                id={component.key}
                aria-label={label}
                value={contentMap.get(selectedLanguage) || ''}
                onChange={(e) => {
                    contentMap.set(selectedLanguage, e.target.value);
                    onChange({
                        ...component,
                        content: generateLocStrings(contentMap),
                    })
                }}
                placeholder={placeholder}
            /> : <Input
                id={component.key}
                aria-label={label}
                value={contentMap.get(selectedLanguage) || ''}
                onChange={(e) => {
                    contentMap.set(selectedLanguage, e.target.value);
                    onChange({
                        ...component,
                        content: generateLocStrings(contentMap),
                    })
                }}
                placeholder={placeholder}
            />}
        </div>
        {!hideStyling && <div className='space-y-1.5 mt-4'>
            <Label
                htmlFor={component.key + 'className'}
            >
                CSS classes
            </Label>
            <Input
                id={component.key + 'className'}
                value={className}
                onChange={(e) => {
                    const newStyle = [...component.style || []];
                    const index = newStyle.findIndex(s => s.key === 'className');
                    if (index > -1) {
                        newStyle[index] = { key: 'className', value: e.target.value };
                    } else {
                        newStyle.push({ key: 'className', value: e.target.value });
                    }

                    onChange({
                        ...component,
                        style: newStyle,
                    })
                }}
                placeholder='Enter optional CSS classes...'
            />
        </div>}
    </div>
}

const AdvancedTextViewContentEditor: React.FC<{
    component: ItemComponent;
    onChange: (newComp: ItemComponent) => void;
}> = (props) => {

    const parts = (props.component as ItemGroupComponent).items || [];

    const onPartsChange = (newParts: ItemComponent[]) => {
        props.onChange({
            ...props.component,
            items: newParts,
        })
    }

    return <div>
        <FormattedTextListEditor
            sortableID={props.component.key + 'formatted-text-list'}
            parts={parts}
            onChange={onPartsChange}
        />
    </div>
}


const TextViewContentEditor: React.FC<TextViewContentEditorProps> = (props) => {
    const isAdvancedMode = props.useAdvancedMode ?? determineAdvancedMode(props.component);

    const onToggleAdvanceMode = (checked: boolean) => {
        if (!confirm('Are you sure you want to switch the editor mode? You will loose the current content.')) {
            return
        }

        const newComp: ItemComponent = {
            ...props.component,
            content: undefined,
            items: undefined,
        };
        if (checked) {
            (newComp as ItemGroupComponent).items = [];
        } else {
            (newComp as ItemGroupComponent).content = [];
        }
        props.onChange(newComp);
    }

    return (
        <div className='space-y-4'>
            {!props.hideToggle && (
                <div className='flex justify-end'>
                    <Label
                        htmlFor={props.component.key + "advanced-mode-switch"}
                        className='flex items-center gap-2'
                    >
                        <Switch
                            id={props.component.key + "advanced-mode-switch"}
                            checked={isAdvancedMode}
                            onCheckedChange={onToggleAdvanceMode}
                        />
                        <span>
                            Use advanced mode
                        </span>
                    </Label>
                </div>)}

            {isAdvancedMode ? (
                <AdvancedTextViewContentEditor
                    component={props.component}
                    onChange={props.onChange}
                />
            ) : (
                <SimpleTextViewContentEditor
                    component={props.component}
                    onChange={props.onChange}
                    hideStyling={props.hideStyling}
                    label={props.label}
                />
            )}
        </div>
    );
};

export default TextViewContentEditor;
