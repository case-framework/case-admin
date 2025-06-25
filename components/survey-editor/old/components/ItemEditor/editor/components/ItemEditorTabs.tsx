import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Asterisk, Bolt, Languages, List, ToggleLeft } from 'lucide-react';
import React from 'react';
import ContentEditor from './content-editor/ContentEditor';
import { SurveyItem } from 'survey-engine/data_types';
import { getItemTypeInfos } from '@/components/survey-editor/old/utils/utils';
import ValidationsTab from './validation-editor/validations-tab';
import GroupItemsEditor from './group-items-editor/group-items-editor';
import AdvancedConfigs from './advanced-configs/advanced-configs';
import ConditionsEditor from './conditions-editor/conditions-editor';


interface ItemEditorTabsProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
    onDeleteItem: (itemKey: string) => void;
}

const ItemEditorTabs: React.FC<ItemEditorTabsProps> = (props) => {

    const typeInfos = getItemTypeInfos(props.surveyItem);

    let tabs = [
        {
            icon: <Languages className='me-1 size-4 text-neutral-500' />,
            label: 'Content',
        },
        {
            icon: <ToggleLeft className='me-1 size-4 text-neutral-500' />,
            label: 'Condition',
        },
        {
            icon: <Asterisk className='me-1 size-4 text-neutral-500' />,
            label: 'Validation',
        },
        {
            icon: <Bolt className='me-1 size-4 text-neutral-500' />,
            label: 'Advanced',
        },
    ]

    if (typeInfos.key === 'pageBreak') {
        return (
            <div className='flex items-center justify-center grow'>
                <p className='text-gray-600'>
                    Page breaks do not have any content to edit.
                </p>
            </div>
        );
    } else if (typeInfos.key === 'group') {
        tabs = [
            {
                icon: <List className='me-1 size-4 text-neutral-500' />,
                label: 'Items',
            },
            {
                icon: <ToggleLeft className='me-1 size-4 text-neutral-500' />,
                label: 'Condition',
            }
        ];
    } else if (typeInfos.key === 'surveyEnd' || typeInfos.key === 'display') {
        tabs = [
            {
                icon: <Languages className='me-1 size-4 text-neutral-500' />,
                label: 'Content',
            },
            {
                icon: <ToggleLeft className='me-1 size-4 text-neutral-500' />,
                label: 'Condition',
            },
            {
                icon: <Bolt className='me-1 size-4 text-neutral-500' />,
                label: 'Advanced',
            },

        ]
    }

    return (
        <div className='p-0 w-full grow bg-background'>
            <Tabs
                key={props.surveyItem.key}
                defaultValue={tabs[0].label.toLocaleLowerCase()}
                className="h-full flex flex-col"
            >
                <div className='flex justify-start border-b border-neutral-300'>
                    <TabsList className='flex flex-wrap justify-start p-0 px-4 pt-0.5 h-auto  gap-1 bg-secondary w-full rounded-none'>
                        {tabs.map(tab => (
                            <TabsTrigger value={tab.label.toLowerCase()} key={tab.label}
                                className='rounded-none rounded-t-md shadow-none border-t border-s border-e border-neutral-300 drop-shadow-none data-[state=active]:shadow-none -mb-px data-[state=active]:ring-offset-0'
                            >
                                <span>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </TabsTrigger>
                        ))}

                    </TabsList>
                </div>

                <TabsContent value="items">
                    <GroupItemsEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                        onDeleteItem={props.onDeleteItem}
                    />
                </TabsContent>

                <TabsContent value="content"
                    className='grow mt-0'
                >
                    <ContentEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </TabsContent>

                <TabsContent value="condition"
                    className='overflow-x-scroll overflow-y-scroll overscroll-x-contain'
                >
                    <ConditionsEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </TabsContent>

                <TabsContent value="validation">
                    <ValidationsTab
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </TabsContent>

                <TabsContent value="advanced">
                    <AdvancedConfigs
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ItemEditorTabs;
