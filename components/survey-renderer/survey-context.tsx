import React, { createContext, useContext } from 'react';
import { Survey, SurveyEngineCore } from 'survey-engine';

export type HandlerFuncArgType = string | number | boolean | null | undefined;

export type HandlerFunction = (handlerId: string, args?: HandlerFuncArgType[]) => Promise<{
    error?: string,
    result?: HandlerFuncArgType,
}>;

interface SurveyContextValue {
    survey: Survey;
    locale: string;
    surveyEngine: SurveyEngineCore;
    runExternalHandler?: HandlerFunction;
}

const SurveyContext = createContext<SurveyContextValue | null>(null);


interface SurveyContextProviderProps {
    survey: Survey;
    locale: string;
    surveyEngine: SurveyEngineCore;
    children: React.ReactNode;
    onRunExternalHandler?: HandlerFunction;
}

export const SurveyContextProvider: React.FC<SurveyContextProviderProps> = ({
    survey,
    locale,
    surveyEngine,
    children,
    onRunExternalHandler
}) => {
    const contextValue: SurveyContextValue = {
        survey,
        locale,
        surveyEngine,
        runExternalHandler: onRunExternalHandler,
    };

    return <SurveyContext.Provider value={contextValue}>
        {children}
    </SurveyContext.Provider>
}

export const useSurveyCtx = () => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurvey must be used within SurveyProvider');
    }
    return context;
};
