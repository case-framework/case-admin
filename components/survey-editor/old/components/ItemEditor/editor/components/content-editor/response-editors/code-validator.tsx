import { localisedObjectToMap } from '@/components/survey-editor/old/utils/localeUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { SimpleFieldConfigs } from './contact-form';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';

interface CodeValidatorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const CodeValidator: React.FC<CodeValidatorProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const codeValidatorCompIndex = rg.items.findIndex(comp => comp.role === 'codeValidator');
    if (codeValidatorCompIndex === undefined || codeValidatorCompIndex === -1) {
        return <p>Code validator not found</p>;
    }

    const codeValidatorComp = rg.items[codeValidatorCompIndex] as ItemGroupComponent;
    if (!codeValidatorComp) {
        return <p>Code validator not found</p>;
    }

    const previewLabelComp = codeValidatorComp.items.find(item => item.role === 'previewLabel');
    const btnLabelComp = codeValidatorComp.items.find(item => item.role === 'btnLabel');
    const dialogComp = codeValidatorComp.items.find(item => item.role === 'dialog');
    const saveBtnComp = codeValidatorComp.items.find(item => item.role === 'saveBtn');
    const resetBtnComp = codeValidatorComp.items.find(item => item.role === 'resetBtn');
    const cancelBtnComp = codeValidatorComp.items.find(item => item.role === 'cancelBtn');
    const codeInvalidMsg = codeValidatorComp.items.find(item => item.role === 'codeInvalidMsg');

    // field config components:
    const codeInputComp = codeValidatorComp.items.find(item => item.role === 'codeInput');

    const linkingCodeComp = codeValidatorComp.items.find(item => item.role === 'linkingCode');
    const studyCodeComp = codeValidatorComp.items.find(item => item.role === 'studyCode');


    const codeType = linkingCodeComp !== undefined ? 'linkingCode' : 'studyCode';
    const codeKey = linkingCodeComp !== undefined ? linkingCodeComp.key : studyCodeComp!.key;

    const onChange = (newComp: ItemComponent, ignoreContent?: boolean) => {

        if (codeValidatorComp.items.findIndex(item => item.role === newComp.role) === -1) {
            codeValidatorComp.items.push({
                role: newComp.role,
                content: ignoreContent ? undefined : generateLocStrings(new Map([[selectedLanguage, '']]))
            })
        }

        codeValidatorComp.items = codeValidatorComp.items.map(item => {
            if (item.role === newComp.role) {
                return newComp;
            }
            return item;
        });
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[codeValidatorCompIndex] = codeValidatorComp;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingComponents,
            }
        });
    };

    const onRemoveField = (field: string) => {
        const newItems = codeValidatorComp.items.filter(item => item.role !== field);
        codeValidatorComp.items = newItems;
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[codeValidatorCompIndex] = codeValidatorComp;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingComponents,
            }
        });

    }

    if (linkingCodeComp === undefined && studyCodeComp === undefined) {
        onChange({
            role: 'linkingCode',
            key: 'code',
        }, true);
        return <p>fix missing code type automatically, open item again if this does not disappear</p>
    }

    return (
        <div className='space-y-4'>


            <Label className='space-y-1.5'>
                <span className=''>
                    Code Validator Type
                </span>

                <div>
                    <Select
                        defaultValue={codeType}
                        onValueChange={(value) => {
                            if (value !== codeType) {
                                onRemoveField(codeType);
                                onChange({ role: value, key: codeKey || value }, true);
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a code validator type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="linkingCode">Linking Code</SelectItem>
                            <SelectItem value="studyCode">Study Code</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Label>


            <div className='space-y-1.5'>
                <Label
                    htmlFor='codeKey'
                >
                    {codeType === 'linkingCode' ? 'Linking Code Key' : 'Study Code Key'}
                </Label>
                <Input
                    id='codeKey'
                    value={codeKey}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                            onRemoveField(codeType);
                            onChange({ role: codeType, key: value }, true);
                        }
                    }}
                    placeholder=''
                />
                <p className='text-xs text-muted-foreground'>
                    {codeType === 'linkingCode' ? 'The key of the linking code to validate' : 'The key of the study code list the code should be in'}
                </p>
            </div>

            <Separator />

            <div className='space-y-1.5'>
                <Label
                    htmlFor='preview-label'
                >
                    Label
                </Label>
                <Input
                    id='preview-label'
                    value={localisedObjectToMap(previewLabelComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'previewLabel', role: 'previewLabel', ...previewLabelComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='e.g. Your code:'
                />
            </div>

            <Separator />

            <div>
                <Label className='space-y-1.5'>
                    <span className=''>
                        Button label
                    </span>
                    <Input
                        value={localisedObjectToMap(btnLabelComp?.content).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedComponent = { key: 'btnLabel', role: 'btnLabel', ...btnLabelComp } as ItemComponent;
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.content = generateLocStrings(updatedContent);
                            onChange(updatedComponent);
                        }}
                        placeholder='e.g. Enter code'
                    />
                </Label>
            </div>

            <div>
                <Label className='space-y-1.5'>
                    <span className=''>
                        Dialog title
                    </span>
                    <Input
                        id='dialog-title'
                        value={localisedObjectToMap(dialogComp?.content).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedComponent = { key: 'dialog', role: 'dialog', ...dialogComp } as ItemComponent;
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.content = generateLocStrings(updatedContent);
                            onChange(updatedComponent);
                        }}
                        placeholder='e.g. Code validation'
                    />
                </Label>
            </div>

            <div>
                <Label className='space-y-1.5'>
                    <span className=''>
                        Dialog description
                    </span>
                    <Input
                        id='dialog-description'
                        value={localisedObjectToMap(dialogComp?.description).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedComponent = { key: 'dialog', role: 'dialog', ...dialogComp } as ItemComponent;
                            const updatedContent = localisedObjectToMap(updatedComponent.description);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.description = generateLocStrings(updatedContent);
                            onChange(updatedComponent);
                        }}
                        placeholder='e.g. Enter your code you have received'
                    />
                </Label>
            </div>

            <SimpleFieldConfigs
                component={codeInputComp as ItemGroupComponent}
                onChange={(newComp) => {
                    if (!newComp) {
                        return;
                    }

                    onChange(newComp);
                }}
                id='codeInput'
                fieldName='Code Input'
                selectedLanguage={selectedLanguage}
                hideToggle={true}
            />

            <div>
                <Label className='space-y-1.5'>
                    <span className=''>
                        Invalid code message
                    </span>
                    <Input
                        value={localisedObjectToMap(codeInvalidMsg?.content).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedComponent = { key: 'invalid', role: 'codeInvalidMsg', ...codeInvalidMsg } as ItemComponent;
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.content = generateLocStrings(updatedContent);
                            onChange(updatedComponent);
                        }}
                        placeholder='e.g. Invalid code'
                    />
                </Label>
            </div>

            <div>
                <Label className='space-y-1.5'>
                    <span className=''>
                        Reset button label
                    </span>
                    <Input
                        id='reset-btn-label'
                        value={localisedObjectToMap(resetBtnComp?.content).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedComponent = { key: 'resetBtn', role: 'resetBtn', ...resetBtnComp } as ItemComponent;
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.content = generateLocStrings(updatedContent);
                            onChange(updatedComponent);
                        }}
                        placeholder='e.g. Reset'
                    />
                </Label>
            </div>

            <div>
                <Label className='space-y-1.5'>
                    <span className=''>
                        Cancel button label
                    </span>
                    <Input
                        id='cancel-btn-label'
                        value={localisedObjectToMap(cancelBtnComp?.content).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedComponent = { key: 'cancelBtn', role: 'cancelBtn', ...cancelBtnComp } as ItemComponent;
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.content = generateLocStrings(updatedContent);
                            onChange(updatedComponent);
                        }}
                        placeholder='e.g. Cancel'
                    />
                </Label>
            </div>

            <div>
                <Label className='space-y-1.5'>
                    <span className=''>
                        Save button label
                    </span>
                    <Input
                        id='save-btn-label'
                        value={localisedObjectToMap(saveBtnComp?.content).get(selectedLanguage) || ''}
                        onChange={(e) => {
                            const updatedComponent = { key: 'saveBtn', role: 'saveBtn', ...saveBtnComp } as ItemComponent;
                            const updatedContent = localisedObjectToMap(updatedComponent.content);
                            updatedContent.set(selectedLanguage, e.target.value);
                            updatedComponent.content = generateLocStrings(updatedContent);
                            onChange(updatedComponent);
                        }}
                        placeholder='e.g. Save'
                    />
                </Label>
            </div>


        </div>
    );
};

export default CodeValidator;
