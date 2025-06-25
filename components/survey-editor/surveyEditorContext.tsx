import { createContext, useContext } from "react";
import { Survey } from "survey-engine/data_types";
import { StoredSurvey } from "./old/utils/SurveyStorage";

interface SurveyEditorContextValue {
    storedSurvey?: StoredSurvey,
    setStoredSurvey: (storedSurvey: StoredSurvey | undefined) => void,
    survey?: Survey,
    setSurvey: (survey: Survey) => void,
    selectedLanguage: string,
    setSelectedLanguage: (lang: string) => void,
}

export const SurveyEditorContext = createContext<SurveyEditorContextValue>({
    survey: undefined,
    setSurvey: () => { },
    selectedLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    setSelectedLanguage: () => { },
    storedSurvey: undefined,
    setStoredSurvey: () => { },
});

interface SurveyEditorContextProviderProps extends SurveyEditorContextValue {
    children?: React.ReactNode;
}

export const SurveyEditorContextProvider: React.FC<SurveyEditorContextProviderProps> = ({ children, ...props }) => {
    const contextValue = {
        ...props,
    };

    return <SurveyEditorContext.Provider value={contextValue}>
        {children}
    </SurveyEditorContext.Provider>
}

export const useSurveyEditorCtx = () => {
    const context = useContext(SurveyEditorContext);
    if (!context) {
        throw new Error('useSurveyEditorCtx must be used within SurveyEditorContextProvider');
    }
    return context;
};
