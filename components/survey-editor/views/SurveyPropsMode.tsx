import LanguageSelector from '@/components/LanguageSelector';
import NotImplemented from '@/components/NotImplemented';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';
import { getLocalizedString } from '@/utils/getLocalisedString';
import { Input, Select, SelectItem, Switch } from '@nextui-org/react';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import React from 'react';
import { BsArrowRight, BsPerson } from 'react-icons/bs';
import { ExpressionArg, LocalizedString } from 'survey-engine/data_types';
import EditorMenu from '../components/EditorMenu';


interface SurveyPropsModeProps {
    editorInstance: SurveyEditor;
}

const getMissingLanguagesForProps = (studyProps: any): string[] => {
    const missingLanguages: string[] = [];
    const requiredLanguages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES?.split(',') || [];

    requiredLanguages.forEach((lang) => {
        if (!studyProps?.name?.find((l: any) => l.code === lang) ||
            !studyProps?.description?.find((l: any) => l.code === lang) ||
            !studyProps?.typicalDuration?.find((l: any) => l.code === lang)) {
            missingLanguages.push(lang);
        }
    });
    return missingLanguages;
}


const SurveyPropsMode: React.FC<SurveyPropsModeProps> = (props) => {
    const currentSurveyDefinition = props.editorInstance.getSurvey().surveyDefinition;
    const [counter, setCounter] = React.useState(0);
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const missingLanguages = getMissingLanguagesForProps(props.editorInstance.getSurvey().props);

    return (
        <div className='max-h-screen overflow-y-scroll'>
            <EditorMenu
                title='Survey Properties'
                editorInstance={props.editorInstance}
            />
            <div className='pt-12 pb-unit-lg px-unit-lg'>
                <TwoColumnsWithCards
                    label='General'
                    description='Define the general properties of the survey.'
                >
                    <div>
                        <Input
                            id='survey-key'
                            label='Survey key'
                            labelPlacement='outside'
                            placeholder='Enter a key for the survey'
                            variant='bordered'
                            description='The survey key is used to identify the survey.'
                            value={currentSurveyDefinition.key}
                            onValueChange={(v) => {
                                props.editorInstance.changeItemKey(currentSurveyDefinition.key, v)
                                setCounter(counter + 1);
                            }}
                        />
                        <div>

                            <Select
                                label='Available for'
                                labelPlacement='outside'
                                description='Define who can access the survey.'
                                variant='bordered'
                                placeholder='Select an option'
                                selectedKeys={props.editorInstance.getSurvey().availableFor ? new Set([props.editorInstance.getSurvey().availableFor as string]) : new Set(['active_participants'])}
                                onSelectionChange={(keys) => {
                                    const selectedKey = (keys as Set<React.Key>).values().next().value;
                                    if (!selectedKey) {
                                        return;
                                    }
                                    props.editorInstance.setAvailableFor(selectedKey);
                                    setCounter(counter + 1);
                                }}
                            >
                                <SelectItem
                                    value='public'
                                    key={'public'}
                                    description='Anyone can access the survey.'
                                >
                                    Public
                                </SelectItem>
                                <SelectItem
                                    key='temporary_participants'
                                    description='The survey can be accessed by temporary or normal participants.'
                                >
                                    Temporary participants
                                </SelectItem>
                                <SelectItem
                                    key='active_participants'
                                    description='The survey can be accessed by active participants of a study.'
                                >
                                    Active participants
                                </SelectItem>
                                <SelectItem
                                    key='participants_if_assigned'
                                    description='Only participants who have this survey assigned can access it.'
                                >
                                    Participants if assigned
                                </SelectItem>
                            </Select>


                            <Switch
                                id='require-login-before-submission'
                                isSelected={props.editorInstance.getSurvey().requireLoginBeforeSubmission}
                                onValueChange={(v) => {
                                    props.editorInstance.setRequireLoginBeforeSubmission(v);
                                    setCounter(counter + 1);
                                }}
                            >
                                Require login before submission
                            </Switch>
                            <p className='text-default-400 text-tiny'>For surveys, that can be started without a participant, or with a temporary participant, this can be used to enforce login before submitting the responses.</p>

                        </div>
                    </div>
                </TwoColumnsWithCards>
                <TwoColumnsWithCards
                    label='Survey card'
                    description='Content of the survey card that is shown in the survey list.'
                >
                    <div className='space-y-unit-md'>
                        <div className='flex justify-end'>
                            <LanguageSelector
                                onLanguageChange={(lang) => {
                                    setSelectedLanguage(lang);
                                }}
                                showBadgeForLanguages={missingLanguages}
                            />
                        </div>

                        <Input
                            id='survey-name'
                            label='Name'
                            labelPlacement='outside'
                            placeholder='Enter a name for the survey'
                            variant='bordered'
                            description='A short title for the survey card.'
                            value={getLocalizedString(props.editorInstance.getSurvey().props?.name, selectedLanguage) || ''}
                            onValueChange={(v) => {
                                const currentName = props.editorInstance.getSurvey().props?.name;
                                if (!currentName) {
                                    props.editorInstance.setSurveyName(
                                        [{
                                            code: selectedLanguage, parts: [
                                                { str: v, dtype: 'str' }
                                            ]
                                        }]
                                    );
                                } else {
                                    const i = currentName.findIndex((l) => l.code === selectedLanguage);
                                    if (i === -1) {
                                        currentName.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                    } else {
                                        ((currentName[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                    }
                                    props.editorInstance.setSurveyName(currentName as LocalizedString[]);
                                }
                                setCounter(counter + 1);
                            }}
                        />
                        <Input
                            id='survey-description'
                            label='Description'
                            labelPlacement='outside'
                            placeholder='Enter a description for the survey'
                            variant='bordered'
                            description='A short description of the survey.'
                            value={getLocalizedString(props.editorInstance.getSurvey().props?.description, selectedLanguage) || ''}
                            onValueChange={(v) => {
                                const current = props.editorInstance.getSurvey().props?.description;
                                if (!current) {
                                    props.editorInstance.setSurveyDescription(
                                        [{
                                            code: selectedLanguage, parts: [
                                                { str: v, dtype: 'str' }
                                            ]
                                        }]
                                    );
                                } else {
                                    const i = current.findIndex((l) => l.code === selectedLanguage);
                                    if (i === -1) {
                                        current.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                    } else {
                                        ((current[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                    }
                                    props.editorInstance.setSurveyDescription(current as LocalizedString[]);
                                }
                                setCounter(counter + 1);
                            }}

                        />
                        <Input
                            id='survey-typical-duration'
                            label='Typical duration'
                            labelPlacement='outside'
                            placeholder='Enter a typical duration for the survey'
                            variant='bordered'
                            description='You can mention the typical duration of the survey here.'
                            value={getLocalizedString(props.editorInstance.getSurvey().props?.typicalDuration, selectedLanguage) || ''}
                            onValueChange={(v) => {
                                const current = props.editorInstance.getSurvey().props?.typicalDuration;
                                if (!current) {
                                    props.editorInstance.setSurveyDuration(
                                        [{
                                            code: selectedLanguage, parts: [
                                                { str: v, dtype: 'str' }
                                            ]
                                        }]
                                    );
                                } else {
                                    const i = current.findIndex((l) => l.code === selectedLanguage);
                                    if (i === -1) {
                                        current.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                    } else {
                                        ((current[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                    }
                                    props.editorInstance.setSurveyDuration(current as LocalizedString[]);
                                }
                                setCounter(counter + 1);
                            }}
                        />
                    </div>
                    <div className='mt-unit-md'>
                        <p className='font-bold'>Card Preview</p>
                        <div className='bg-content3 p-unit-sm rounded-small'>
                            <p className='font-bold'>
                                <span className="text-xl">
                                    {getLocalizedString(props.editorInstance.getSurvey().props?.name, selectedLanguage) || '<Survey name>'}
                                </span>
                                <span className={'ms-1 text-normal font-normal text-black/60'}>
                                    {getLocalizedString(props.editorInstance.getSurvey().props?.typicalDuration, selectedLanguage) || '<Typical duration>'}
                                </span>
                            </p>
                            <p className="italic">
                                {getLocalizedString(props.editorInstance.getSurvey().props?.description, selectedLanguage) || '<Survey description>'}
                            </p>
                            <div className='flex justify-end items-center mt-2 '>
                                <div className={'flex items-center bg-white rounded-small p-unit-2'}>
                                    <div className='bg-white'>
                                        <BsPerson />
                                    </div>
                                    <span className='ms-2 inline-block truncate max-w-[200px]'>
                                        {'Participant'}
                                    </span>
                                    <BsArrowRight className='ms-2' />
                                </div>
                            </div>
                        </div>

                    </div>

                </TwoColumnsWithCards>
                <TwoColumnsWithCards
                    label='Runtime context'
                    description='If defined these rules govern what extra information is passed with the survey definition, e.g., for prefilling questions or for the context object that can be used in conditions.'
                >
                    <div className='space-y-unit-md'>
                        <NotImplemented>
                            preview of rules | expression editor for prefill rules
                        </NotImplemented>
                        <NotImplemented>
                            preview of rules | expression editor for runtime context
                        </NotImplemented>
                    </div>
                </TwoColumnsWithCards>
                <TwoColumnsWithCards
                    label='Metadata'
                    description='You can provide custom key-value pairs that will be stored with the survey definition.'
                >
                    <NotImplemented>
                        add, edit, delete metadata (key value pairs)
                    </NotImplemented>
                </TwoColumnsWithCards>
            </div>
        </div>
    );
};

export default SurveyPropsMode;
