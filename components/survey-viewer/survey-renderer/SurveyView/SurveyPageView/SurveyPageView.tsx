import React, { useState, Dispatch, SetStateAction, useRef } from 'react';
import { SurveySingleItem } from 'survey-engine/data_types';
import { SurveyEngineCore } from 'survey-engine/engine';
import SurveySingleItemView from '../../SurveySingleItemView/SurveySingleItemView';

import { checkSurveyItemsValidity, checkSurveyItemValidity } from 'survey-engine/validation-checkers';
import { getItemComponentByRole, getLocaleStringTextByCode } from '../../SurveySingleItemView/utils';
import { CustomSurveyResponseComponent } from '../../SurveySingleItemView/ResponseComponent/ResponseComponent';
import { Button } from '@nextui-org/button';


interface SurveyPageLocalisedTexts {
    backBtn: string;
    nextBtn: string;
    submitBtn: string;
    invalidResponse: string;
}

interface SurveyPageViewProps {
    loading?: boolean;
    surveyEngine: SurveyEngineCore;
    surveyItems: SurveySingleItem[];
    selectedLanguage: string;
    responseCount: number;
    setResponseCount: Dispatch<SetStateAction<number>>;
    onNextPage: () => void;
    onPreviousPage: () => void;
    showBackButton: boolean;
    onSubmit: () => void;
    isLastPage: boolean;
    localisedTexts: SurveyPageLocalisedTexts;
    surveyEndItem?: SurveySingleItem;
    ignoreValidation?: boolean;
    showKeys?: boolean;
    customResponseComponents?: Array<CustomSurveyResponseComponent>;
    dateLocales?: Array<{ code: string, locale: any, format: string }>;
}

const SurveyPageView: React.FC<SurveyPageViewProps> = (props) => {
    const [displayedKeys, setDisplayedKeys] = useState<Array<string>>([]);
    const [showValidationErrors, setShowValidationErrors] = useState(false);

    const responses = props.surveyEngine.getResponses();

    const currentDisplayedKeys = props.surveyItems.map(item => item.key);
    if (displayedKeys.length > 0 && !displayedKeys.every(key => currentDisplayedKeys.includes(key))) {
        setDisplayedKeys(prev => {
            return prev.filter(key => currentDisplayedKeys.includes(key));
        })
    }

    const elRefs = useRef<HTMLDivElement>(null);
    const firstInvalidIndex = props.surveyItems.findIndex(it => !checkSurveyItemValidity(it).hard);

    const mapSurveyItemToComp = (surveyItem: SurveySingleItem, index: number): React.ReactNode => {
        if (surveyItem.type === 'surveyEnd') {
            return <></>
        }
        if (!displayedKeys.includes(surveyItem.key)) {
            props.surveyEngine.questionDisplayed(surveyItem.key);
            setDisplayedKeys(prev => {
                return [...prev, surveyItem.key];
            })
        }

        const itemResponse = responses.find((value) => value.key === surveyItem.key);
        const response = (itemResponse) ? itemResponse.response : undefined;

        const valid = checkSurveyItemValidity(surveyItem);

        return <div
            ref={index === firstInvalidIndex ? elRefs : null}
        >
            <SurveySingleItemView
                renderItem={surveyItem}
                languageCode={props.selectedLanguage}
                responseChanged={(response) => {
                    props.surveyEngine.setResponse(surveyItem.key, response);
                    // Rerender page by updating state
                    props.setResponseCount(props.responseCount + 1);
                }}
                responsePrefill={response}
                showInvalid={!valid.hard && showValidationErrors}
                invalidWarning={props.localisedTexts.invalidResponse}
                showKeys={props.showKeys}
                customResponseComponents={props.customResponseComponents}
                dateLocales={props.dateLocales}
            />
        </div>
    }

    const valid = checkSurveyItemsValidity(props.surveyItems);

    const handleClickWithValidation = (handler: () => void) => {
        if (props.ignoreValidation) {
            handler();
            return;
        }
        if (!valid.hard) {
            setShowValidationErrors(true);
            // console.log(elRefs)

            // Scroll to first invalid item
            if (elRefs.current) {
                elRefs.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
            return;
        }
        setShowValidationErrors(false);
        handler();
    };

    const surveyEnd = () => {
        const titleComp = getItemComponentByRole(props.surveyEndItem?.components?.items, 'title');
        return <div
            className="bg-gray-100 rounded px-4 sm:px-6 py-4 sm:py-6"
        >
            {titleComp ? <h5 className="text-primary-600 text-xl font-bold mb-4">{getLocaleStringTextByCode(titleComp.content, props.selectedLanguage)}</h5> : null}
            <div className='flex gap-4'>
                {props.showBackButton ?
                    <Button
                        color='primary'
                        variant='bordered'
                        type="button"
                        id="back"
                        className='text-lg font-semibold'
                        onClick={props.onPreviousPage}
                        disabled={props.loading}
                        autoFocus={false}
                    >
                        {props.localisedTexts.backBtn}
                    </Button>
                    : null}
                <Button
                    type="button"
                    id="submit"
                    color='primary'
                    className='text-lg font-semibold'
                    onPress={(event) => {
                        handleClickWithValidation(props.onSubmit)
                    }
                    }
                    disabled={props.loading}
                    autoFocus={false}
                >
                    {props.localisedTexts.submitBtn}
                </Button>
            </div>
        </div>
    };

    const surveyNavigation = () => (
        <div
            className="flex gap-4 justify-center my-3"
        >
            {props.showBackButton ?
                <Button
                    type="button"
                    id="back"
                    color='primary'
                    variant='bordered'
                    className='text-lg font-semibold'
                    onPress={(event) => {
                        props.onPreviousPage()
                    }}
                    disabled={props.loading}
                    autoFocus={false}
                >
                    {props.localisedTexts.backBtn}
                </Button>
                : null}
            <Button
                type="button"
                id="next"
                name="next"
                color='primary'
                className='text-lg font-semibold'
                onPress={(event) => {
                    handleClickWithValidation(props.onNextPage)
                }}
                disabled={props.loading}
                autoFocus={false}
            >
                {props.localisedTexts.nextBtn}
            </Button>
        </div>
    );

    return (
        <div className='flex flex-col gap-4'>
            {
                props.surveyItems.map((surveyItem, index) =>
                    <div
                        key={surveyItem.key}>
                        {mapSurveyItemToComp(surveyItem, index)}
                    </div>
                )
            }
            {props.isLastPage ? surveyEnd() : surveyNavigation()}
        </div>
    );
};

export default SurveyPageView;
