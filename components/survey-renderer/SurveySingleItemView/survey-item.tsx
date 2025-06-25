import React from 'react';
import { RenderedSurveyItem, SurveyItemType } from 'survey-engine';
import { SurveyItemContextProvider } from './survey-item-context';
import SingleChoiceQuestionRenderer from './survey-item-types/single-choice-question-renderer';

interface SurveyItemRendererProps {
    item: RenderedSurveyItem;
}


const SurveyItemRenderer: React.FC<SurveyItemRendererProps> = ({ item }) => {

    const renderedItem = () => {
        switch (item.type) {
            case SurveyItemType.SingleChoiceQuestion:
                return <SingleChoiceQuestionRenderer />
            default:
                return <p>not implemented</p>
        }
    }


    return (
        <SurveyItemContextProvider renderedItemInfos={item}>
            {renderedItem()}
        </SurveyItemContextProvider>
    )
}

export default SurveyItemRenderer;
