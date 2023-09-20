import React, { useState, useEffect } from 'react';
import { Survey, SurveySingleItemResponse, SurveyContext } from 'survey-engine/data_types';
import { SurveyEngineCore } from 'survey-engine/engine';
import { CustomSurveyResponseComponent } from '../SurveySingleItemView/ResponseComponent/ResponseComponent';
import SurveyPageView from './SurveyPageView/SurveyPageView';
import SurveyProgress from './SurveyProgress/SurveyProgress';
import { isFirefox } from 'react-device-detect';

interface SurveyViewProps {
  loading?: boolean;
  survey: Survey;
  languageCode: string;
  onSubmit: (responses: SurveySingleItemResponse[], version: string) => void;
  onResponsesChanged?: (responses: SurveySingleItemResponse[], version: string, surveyEngine?: SurveyEngineCore) => void;
  prefills?: SurveySingleItemResponse[];
  context?: SurveyContext;
  backBtnText: string;
  nextBtnText: string;
  submitBtnText: string;
  invalidResponseText: string;
  hideBackButton?: boolean;
  showKeys?: boolean;
  customResponseComponents?: Array<CustomSurveyResponseComponent>;
  dateLocales?: Array<{ code: string, locale: any, format: string }>;
  showEngineDebugMsg?: boolean;
  // init with temporary loaded results
  // save temporary result
}


const SurveyView: React.FC<SurveyViewProps> = (props) => {
  const [surveyEngine, setSurveyEngine] = useState<SurveyEngineCore>(new SurveyEngineCore(props.survey, props.context, props.prefills, props.showEngineDebugMsg));
  const surveyPages = surveyEngine.getSurveyPages();

  const [responseCount, setResponseCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setSurveyEngine(new SurveyEngineCore(props.survey, props.context, props.prefills));
  }, [props.survey, props.context, props.prefills]);

  const onResponsesChanged = () => {
    if (props.onResponsesChanged) {
      const resp = surveyEngine.getResponses();
      props.onResponsesChanged(resp, props.survey.versionId, surveyEngine);
    }
  }

  const onSubmit = () => {
    const resp = surveyEngine.getResponses();
    props.onSubmit(resp, props.survey.versionId);
  }

  const resetScrollPosition = () => {
    if (isFirefox) {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 10)
    } else {
      window.scrollTo(0, 0)
    }
  }

  // console.log(surveyEngine.getSurveyEndItem());

  const renderCurrentPage = () => {
    if (currentPage < 0 || currentPage > surveyPages.length - 1) {
      setCurrentPage(0);
      return;
    }

    const isLastPage = currentPage >= surveyPages.length - 1;
    return <SurveyPageView
      loading={props.loading}
      surveyEngine={surveyEngine}
      surveyItems={surveyPages[currentPage]}
      localisedTexts={{
        backBtn: props.backBtnText,
        nextBtn: props.nextBtnText,
        submitBtn: props.submitBtnText,
        invalidResponse: props.invalidResponseText ? props.invalidResponseText : '',
      }}
      showBackButton={currentPage > 0 && !props.hideBackButton}
      onPreviousPage={() => {
        setCurrentPage(prev => Math.max(0, prev - 1));
      }}
      onNextPage={() => {
        setCurrentPage(prev => prev + 1);
        resetScrollPosition();
      }}
      surveyEndItem={surveyEngine.getSurveyEndItem()}
      onSubmit={onSubmit}
      isLastPage={isLastPage}
      selectedLanguage={props.languageCode}
      responseCount={responseCount}
      setResponseCount={(count) => {
        setResponseCount(count);
        onResponsesChanged();
      }}
      showKeys={props.showKeys}
      customResponseComponents={props.customResponseComponents}
      dateLocales={props.dateLocales}
    />;
  }

  return (
    <>
      {surveyPages.length > 1 ?
        <div className="p-6">
          <SurveyProgress
            currentIndex={currentPage}
            totalCount={surveyPages.length}
          />
        </div> : null}
      {renderCurrentPage()}
    </>
  );
};

export default SurveyView;
