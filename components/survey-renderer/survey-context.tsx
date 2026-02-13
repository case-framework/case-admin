import React, { createContext, useContext } from 'react';

export type HandlerFuncArgType = string | number | boolean | null | undefined;

export type HandlerFunction = (handlerId: string, args?: HandlerFuncArgType[]) => Promise<{
    error?: string,
    result?: HandlerFuncArgType,
}>;

interface SurveyContextValue {
    translations: {
        helpBtnAriaLabel?: string;
    }
    runExternalHandler?: HandlerFunction;
}

const SurveyContext = createContext<SurveyContextValue | null>(null);


interface SurveyContextProviderProps {
    translations: {
        helpBtnAriaLabel?: string;
    }
    children: React.ReactNode;
    onRunExternalHandler?: HandlerFunction;
}

export const SurveyContextProvider: React.FC<SurveyContextProviderProps> = ({
    children,
    translations,
    onRunExternalHandler
}) => {
    const contextValue: SurveyContextValue = {
        translations,
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
