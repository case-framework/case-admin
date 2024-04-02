import LanguageSelector from '@/components/LanguageSelector';
import { getItemTypeInfos } from '@/components/survey-editor/utils/utils';
import { getItemComponentByRole } from '@/components/survey-viewer/survey-renderer/SurveySingleItemView/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { getLocalizedString } from '@/utils/getLocalisedString';
import { GripVertical, MoreVertical } from 'lucide-react';
import React from 'react';
import { ItemGroupComponent, SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import SurveyEndEditor from './ItemTypeContentEditors/SurveyEndEditor';

interface ContentEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}


const ContentEditor: React.FC<ContentEditorProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const typeInfos = getItemTypeInfos(props.surveyItem);


    if (typeInfos.key === 'surveyEnd') {
        return (
            <div className='py-4'>
                <SurveyEndEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </div>
        );
    } else if (typeInfos.key === 'display') {
        return (
            <div className='flex items-center justify-center grow'>
                <p className='text-gray-600'>
                    TODO: Display content editor
                </p>
            </div>
        );
    }

    return (
        <div className='mx-auto'>
            <p>
                TODO: get header components
            </p>
            <p>
                top component
            </p>

            <p>
                response - specific to question type - single choice, multiple choice, etc. - hint for custom
            </p>
            <p>
                bottom component
            </p>
            <p>
                footnote
            </p>
        </div>
    )



    const title = getItemComponentByRole((props.surveyItem as SurveySingleItem).components?.items, 'title');
    console.log(title)

    const titleText = getLocalizedString(title?.content, selectedLanguage);
    console.log(titleText)

    const responseGroup = getItemComponentByRole((props.surveyItem as SurveySingleItem).components?.items, 'responseGroup');
    const scgItems = ((responseGroup as ItemGroupComponent)?.items?.find(i => i.role === 'singleChoiceGroup') as ItemGroupComponent)?.items;

    console.log(scgItems)

    if (!scgItems) {
        return null;
    }


    return (
        <div className='mt-4'>
            <div className='flex justify-end'>
                <LanguageSelector
                    onLanguageChange={setSelectedLanguage}
                />
            </div>

            <div className='space-y-3 my-4 p-4 bg-white rounded-md'>
                <h3 className='font-bold'>
                    Header
                </h3>

                <div className='p-1 px-2 bg-slate-100 rounded-md'>
                    <Label className='font-bold text-xs'>
                        Title
                    </Label>
                    <Textarea
                        value={titleText}

                    />
                </div>

            </div>

            <div className='space-y-3 my-4 p-4 bg-white rounded-md'>
                <h3 className='font-bold'>
                    Response options
                </h3>

                {scgItems.map((item, index) => {
                    const itemText = getLocalizedString(item.content, selectedLanguage);
                    return (
                        <div key={index} className='flex gap-2 items-center p-1 bg-slate-100 rounded-md'>
                            <span>
                                <GripVertical className='size-5 text-neutral-500' />
                            </span>
                            <Input
                                className='w-12'
                                value={item.key}
                            />
                            <Input className='grow'
                                value={itemText}
                            />
                            <Button
                                variant={'ghost'}
                                size='icon'
                            >
                                <MoreVertical className='size-5' />
                            </Button>
                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default ContentEditor;
