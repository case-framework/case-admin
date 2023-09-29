import LanguageSelector from '@/components/LanguageSelector';
import NotImplemented from '@/components/NotImplemented';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';
import { getLocalizedString } from '@/utils/getLocalisedString';
import { Button, Divider, Input, Select, SelectItem, Switch } from '@nextui-org/react';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import React, { useEffect } from 'react';
import { BsArrowRight, BsCheck, BsPencil, BsPerson, BsX } from 'react-icons/bs';
import { ExpressionArg, LocalizedString, SurveyProps } from 'survey-engine/data_types';
import EditorMenu from '../components/EditorMenu';
import SurveyMetadataEditor from '../components/SurveyMetadataEditor';
import MonacoSurveyPrefillRuleEditor from '../components/MonacoSurveyPrefillRuleEditor';



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

const SurveyCardEditor: React.FC<{
    surveyProps: SurveyProps,
    onChanges: (props: SurveyProps) => void,
}> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
    const [currenctSurveyProps, setCurrentSurveyProps] = React.useState<SurveyProps>(props.surveyProps);
    const [editMode, setEditMode] = React.useState(false);

    useEffect(() => {
        setCurrentSurveyProps(props.surveyProps);
    }, [props.surveyProps])

    const missingLanguages = getMissingLanguagesForProps(currenctSurveyProps);


    return <div className='space-y-unit-md'>
        <div className='flex justify-end'>
            <LanguageSelector
                onLanguageChange={(lang) => {
                    setSelectedLanguage(lang);
                }}
                showBadgeForLanguages={missingLanguages}
            />
        </div>
        {editMode ?
            (
                <div className='flex flex-col gap-y-unit-sm'>
                    <h3 className='text-large font-bold mb-1'>Edit card values:</h3>

                    <Input
                        id='survey-name'
                        label='Name'
                        labelPlacement='outside'
                        placeholder='Enter a name for the survey'
                        variant='bordered'
                        description='A short title for the survey card.'
                        classNames={{
                            inputWrapper: 'bg-white'
                        }}
                        value={getLocalizedString(currenctSurveyProps.name, selectedLanguage) || ''}
                        onValueChange={(v) => {
                            const currentName = currenctSurveyProps.name;
                            if (!currentName) {
                                setCurrentSurveyProps((prev) => ({
                                    ...prev,
                                    name: [{
                                        code: selectedLanguage, parts: [
                                            { str: v, dtype: 'str' }
                                        ]
                                    }]
                                }));
                            } else {
                                const i = currentName.findIndex((l) => l.code === selectedLanguage);
                                if (i === -1) {
                                    currentName.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                } else {
                                    ((currentName[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                }
                                setCurrentSurveyProps((prev) => ({
                                    ...prev,
                                    name: currentName as LocalizedString[]
                                }));
                            }
                        }}
                    />

                    <Input
                        id='survey-typical-duration'
                        label='Typical duration'
                        labelPlacement='outside'
                        placeholder='Enter a typical duration for the survey'
                        variant='bordered'
                        description='You can mention the typical duration of the survey here.'
                        classNames={{
                            inputWrapper: 'bg-white'
                        }}
                        value={getLocalizedString(currenctSurveyProps.typicalDuration, selectedLanguage) || ''}
                        onValueChange={(v) => {
                            const current = currenctSurveyProps.typicalDuration;
                            if (!current) {
                                setCurrentSurveyProps((prev) => ({
                                    ...prev,
                                    typicalDuration: [{
                                        code: selectedLanguage, parts: [
                                            { str: v, dtype: 'str' }
                                        ]
                                    }]
                                }));
                            } else {
                                const i = current.findIndex((l) => l.code === selectedLanguage);
                                if (i === -1) {
                                    current.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                } else {
                                    ((current[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                }

                                setCurrentSurveyProps((prev) => ({
                                    ...prev,
                                    typicalDuration: current
                                }));
                            }
                        }}
                    />

                    <Input
                        id='survey-description'
                        label='Description'
                        labelPlacement='outside'
                        placeholder='Enter a description for the survey'
                        variant='bordered'
                        description='A short description of the survey.'
                        classNames={{
                            inputWrapper: 'bg-white'
                        }}
                        value={getLocalizedString(currenctSurveyProps.description, selectedLanguage) || ''}
                        onValueChange={(v) => {
                            const current = currenctSurveyProps.description;
                            if (!current) {
                                setCurrentSurveyProps((prev) => ({
                                    ...prev,
                                    description: [{
                                        code: selectedLanguage, parts: [
                                            { str: v, dtype: 'str' }
                                        ]
                                    }]
                                }));
                            } else {
                                const i = current.findIndex((l) => l.code === selectedLanguage);
                                if (i === -1) {
                                    current.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                } else {
                                    ((current[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                }
                                setCurrentSurveyProps((prev) => ({
                                    ...prev,
                                    description: current,
                                }));
                            }
                        }}

                    />

                    <div className='flex gap-unit-sm'>
                        <Button
                            variant='light'
                            color='danger'
                            startContent={<BsX />}
                            onPress={() => {
                                setEditMode(false);
                                setCurrentSurveyProps(props.surveyProps);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='flat'
                            color='primary'
                            startContent={<BsCheck />}
                            onPress={() => {
                                props.onChanges(currenctSurveyProps);
                                setEditMode(false);
                            }}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            ) : (
                <div className=''>
                    <h3 className='text-large font-bold mb-1'>Card preview:</h3>

                    <div className='bg-content3 p-unit-sm rounded-small  mb-unit-sm'>
                        <p className='font-bold'>
                            <span className="text-xl">
                                {getLocalizedString(currenctSurveyProps.name, selectedLanguage) || '<Survey name>'}
                            </span>
                            <span className={'ms-1 text-normal font-normal text-black/60'}>
                                {getLocalizedString(currenctSurveyProps.typicalDuration, selectedLanguage) || '<Typical duration>'}
                            </span>
                        </p>
                        <p className="italic">
                            {getLocalizedString(currenctSurveyProps.description, selectedLanguage) || '<Survey description>'}
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

                    <Button
                        color='default'
                        onPress={() => {
                            setEditMode(true);
                        }}
                        startContent={<BsPencil />}
                    >
                        Edit
                    </Button>
                </div>
            )
        }
    </div>
}


const SurveyPropsMode: React.FC<SurveyPropsModeProps> = (props) => {
    const currentSurveyDefinition = props.editorInstance.getSurvey().surveyDefinition;
    const [counter, setCounter] = React.useState(0);


    return (
        <div className='max-h-screen overflow-y-scroll'>
            <EditorMenu
                title='Survey Properties'
                editorInstance={props.editorInstance}
            />
            <div className='pt-12 pb-unit-lg px-unit-lg'>
                <h2 className='text-3xl font-bold mb-unit-md mt-unit-lg'>
                    General
                </h2>
                <TwoColumnsWithCards
                    label='Key & Availability'
                    description='The survey will be referred to by the survey key. You can also define availability of the survey (who can access it) and whether login is required before submission'
                >
                    <div className='space-y-unit-sm'>
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

                        <div>
                            <Switch
                                id='require-login-before-submission'
                                isSelected={props.editorInstance.getSurvey().requireLoginBeforeSubmission || false}
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
                    <SurveyCardEditor
                        surveyProps={props.editorInstance.getSurvey().props || {}}
                        onChanges={(surveyProps) => {
                            props.editorInstance.setSurveyName(surveyProps.name as LocalizedString[]);
                            props.editorInstance.setSurveyDescription(surveyProps.description as LocalizedString[]);
                            props.editorInstance.setSurveyDuration(surveyProps.typicalDuration as LocalizedString[]);
                            setCounter(counter + 1);
                        }}
                    />
                </TwoColumnsWithCards>
                <Divider />
                <h2 className='text-3xl font-bold mb-unit-md mt-unit-lg'>Advanced</h2>
                <TwoColumnsWithCards
                    label='Runtime context'
                    description='Define rules that so the server generates responses for the questionnaire to prefill certain answers.'
                >
                    <MonacoSurveyPrefillRuleEditor
                        prefillRules={props.editorInstance.getSurvey().prefillRules || []}
                        onPrefillRulesChange={(rules) => {
                            props.editorInstance.setPrefillRules(rules);
                            setCounter(counter + 1);
                        }}
                    />
                </TwoColumnsWithCards>
                <TwoColumnsWithCards
                    label='Metadata'
                    description='You can provide custom key-value pairs that will be stored with the survey definition.'
                >
                    <SurveyMetadataEditor
                        metadata={props.editorInstance.getSurvey().metadata || {}}
                        onChange={(metadata) => {
                            props.editorInstance.setMetadata(metadata);
                            setCounter(counter + 1);
                        }}
                    />
                </TwoColumnsWithCards>
            </div>
        </div>
    );
};

export default SurveyPropsMode;
