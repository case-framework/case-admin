'use client';

import { ContentType, ItemComponentType, SingleChoiceQuestionItem, Survey, SurveyEngineCore, SurveyItemType } from "survey-engine";
import SurveyItemRenderer from "../survey-renderer/SurveySingleItemView/survey-item";
import { SurveyContextProvider } from "../survey-renderer/survey-context";
import { useEffect, useState } from "react";
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from "../ui/select";
import { SurveyItemTranslations } from "survey-engine";

import { SurveyEditor, SingleChoiceQuestionEditor, gt, const_number, response_string, str_eq, const_string, and } from "survey-engine/editor";
import { Button } from "../ui/button";


const editor = new SurveyEditor(new Survey());

editor.addItem(undefined, SingleChoiceQuestionItem.fromJson('survey.Q1', {
    itemType: SurveyItemType.SingleChoiceQuestion,
    header: {
        title: {
            key: 'title',
            type: ItemComponentType.Text
        },
        subtitle: {
            key: 'subtitle',
            type: ItemComponentType.Text
        }
    },

    responseConfig: {
        type: ItemComponentType.SingleChoice,
        key: 'scg',
        properties: {
            shuffleItems: true
        },
        items: [
            /* {
                key: 'A1',
                type: ItemComponentType.ScgMcgOption,
            },
            {
                key: 'A2',
                type: ItemComponentType.ScgMcgOption,
            }, */
        ]
    }
}), new SurveyItemTranslations())

/* editor.updateItemTranslations('survey.Q1', {
    'nl': {
        'scg.A1': {
            type: LocalizedContentType.CQM,
            content: 'Rood',
            attributions: []
        },
        'scg.A2': {
            type: LocalizedContentType.CQM,
            content: 'Blauw',
            attributions: []
        }
    },
    'en': {
        'subtitle': {
            type: LocalizedContentType.CQM,
            content: 'This is a subtitle lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
            attributions: []
        },
        'scg.A1': {
            type: LocalizedContentType.CQM,
            content: 'Red',
            attributions: []
        },
        'scg.A2': {
            type: LocalizedContentType.CQM,
            content: 'Blue',
            attributions: []
        }
    }
}) */

const questionEditor = new SingleChoiceQuestionEditor(
    editor, 'survey.Q1'
);

questionEditor.title.updateContent('en', {
    type: ContentType.CQM,
    content: 'What is your favorite color with a long title that should be wrapped and a subtitle?',
    attributions: []
}, undefined);

questionEditor.title.updateContent('nl', {
    type: ContentType.CQM,
    content: 'Wat is je favoriete kleur?',
    attributions: []
});

questionEditor.subtitle.updateContent('en', {
    type: ContentType.CQM,
    content: 'This is a subtitle lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    attributions: []
});



questionEditor.addNewOption('A1', ItemComponentType.ScgMcgOption)
questionEditor.addNewOption('A2', ItemComponentType.ScgMcgOption, 0)
questionEditor.addNewOption('A3', ItemComponentType.ScgMcgOption)



questionEditor.swapOptions(1, 0);


questionEditor.optionEditors[0].updateContent('en', {
    type: ContentType.CQM,
    content: 'Red',
    attributions: []
});

questionEditor.optionEditors[1].updateContent('en', {
    type: ContentType.CQM,
    content: 'Blue',
    attributions: []
});

questionEditor.optionEditors[2].updateContent('en', {
    type: ContentType.CQM,
    content: 'Green',
    attributions: []
});

questionEditor.optionEditors[0].updateContent('nl', {
    type: ContentType.CQM,
    content: 'Rood',
    attributions: []
});
questionEditor.optionEditors[1].updateContent('nl', {
    type: ContentType.CQM,
    content: 'Blauw',
    attributions: []
});

questionEditor.optionEditors[2].updateContent('nl', {
    type: ContentType.CQM,
    content: 'Groen',
    attributions: []
});


questionEditor.optionEditors[0].setDisableCondition(
    and(
        gt(
            const_number(31),
            const_number(2)
        ),
        str_eq(
            response_string('survey.Q1...get'),
            const_string('A2')
        )
    ).getExpression()
)

questionEditor.optionEditors[1].setDisableCondition(
    gt(
        const_number(31),
        const_number(2)
    ).getExpression()
)



const surveyFile = editor.survey.toJson();

/* const surveyFile: JsonSurvey = {
    $schema: 'https://github.com/case-framework/survey-engine/schemas/survey-schema.json',
    surveyItems: {
        'survey': {
            itemType: SurveyItemType.Group,
            items: [
                'survey.Q1'
            ]
        },
        'survey.Q1': {
            itemType: SurveyItemType.SingleChoiceQuestion,
            responseConfig: {
                type: ItemComponentType.SingleChoice,
                key: 'scg',
                items: [
                    {
                        key: 'A1',
                        type: ItemComponentType.ScgMcgOption,
                    },
                    {
                        key: 'A2',
                        type: ItemComponentType.ScgMcgOption,
                    }
                ]
            }
        }
    },
    translations: {
        'en': {
            'survey.Q1': {
                'title': {
                    type: LocalizedContentType.CQM,
                    content: 'What is your favorite color?',
                    attributions: []
                },
                'scg.A1': {
                    type: LocalizedContentType.CQM,
                    content: 'Red',
                    attributions: []
                },
                'scg.A2': {
                    type: LocalizedContentType.CQM,
                    content: 'Blue',
                    attributions: []
                }
            }
        },
        'nl': {
            'survey.Q1': {
                'title': {
                    type: LocalizedContentType.CQM,
                    content: 'Wat is je favoriete kleur?',
                    attributions: []
                },
                'scg.A1': {
                    type: LocalizedContentType.CQM,
                    content: 'Rood',
                    attributions: []
                },
                'scg.A2': {
                    type: LocalizedContentType.CQM,
                    content: 'Blauw',
                    attributions: []
                }
            }
        }
    }
} */

const readSurveyFile = Survey.fromJson(surveyFile);


const TestPreview: React.FC = () => {

    const [surveyEngine] = useState<SurveyEngineCore>(new SurveyEngineCore(
        readSurveyFile,
        undefined,
        [
            {
                key: 'survey.Q1',
                itemType: SurveyItemType.SingleChoiceQuestion,
                response: {
                    value: 'A2',
                }
            }
        ]
    ));
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Liquid Glass Background */}
            <div className="absolute hidden inset-0 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="absolute inset-0 bg-linear-to-tr from-blue-100/30 via-purple-100/20 to-pink-100/30"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-8 px-4 gap-6">
                {/* Language Selector with Liquid Glass Effect */}
                <div className="flex w-full justify-end max-w-[832px]">
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-1 shadow-2xl">
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger className="w-[180px] bg-transparent border-0 backdrop-blur-none shadow-none focus:ring-0 text-gray-800 font-medium">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl shadow-2xl">
                                <SelectItem value="en" className="hover:bg-white/50 rounded-xl transition-all duration-200">English</SelectItem>
                                <SelectItem value="nl" className="hover:bg-white/50 rounded-xl transition-all duration-200">Dutch</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Survey Container with Liquid Glass Effect */}
                <div className='max-w-[832px] w-full mx-auto space-y-6 survey'>
                    <div
                        //    className='backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl @container relative overflow-hidden'
                        className='backdrop-blur-xl bg-white/10 border border-black/10 p-8 rounded-xl shadow-s2xl @container relative overflow-hidden'>
                        {/* Inner glass reflection effect */}
                        <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent rounded-3xl"></div>
                        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
                        <div className="absolute top-0 left-0 h-full w-px bg-linear-to-b from-transparent via-white/40 to-transparent"></div>

                        {/* Content */}
                        <div className="relative z-10">
                            <SurveyContextProvider
                                survey={surveyEngine.survey}
                                onRunExternalHandler={undefined}
                                locale={selectedLanguage}
                                surveyEngine={surveyEngine}
                            >
                                <SurveyItemRenderer
                                    item={surveyEngine.getSurveyPages()[0][0]}
                                />
                            </SurveyContextProvider>
                        </div>
                    </div>
                </div>

                <Button onClick={() => {
                    console.log(surveyEngine.getResponses())
                }}>
                    Get Responses
                </Button>
            </div>

        </div>

    );
};


export default TestPreview;
