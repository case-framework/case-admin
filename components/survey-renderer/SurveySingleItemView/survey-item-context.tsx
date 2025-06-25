import { createContext, useContext, useEffect, useRef, useState } from "react";
import { RenderedSurveyItem, ResponseItem, SurveyItem, SurveyItemTranslations } from "survey-engine";
import { useSurveyCtx } from "../survey-context";


interface SurveyItemContextValue {
    item: SurveyItem;
    renderedItemInfos: RenderedSurveyItem;
    itemTranslations?: SurveyItemTranslations;
    currentResponse?: ResponseItem;
    headerId: string;
    width: number;

    setResponse(response?: ResponseItem): void;
}


const SurveyItemContext = createContext<SurveyItemContextValue | null>(null);


interface SurveyItemContextProviderProps {
    children: React.ReactNode;
    renderedItemInfos: RenderedSurveyItem;
}

export const SurveyItemContextProvider: React.FC<SurveyItemContextProviderProps> = ({
    children,
    renderedItemInfos,
}) => {
    const { survey, surveyEngine } = useSurveyCtx();
    const [width, setWidth] = useState<number | null>(null);
    const [currentResponse, setCurrentResponse] = useState<ResponseItem | undefined>(
        surveyEngine.getResponseItem(renderedItemInfos.key.fullKey)?.response
    );
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;


        const updateWidth = () => {
            setWidth(containerRef.current?.offsetWidth ?? null);
        };

        // Set initial width
        updateWidth();

        // Create ResizeObserver to track width changes
        const resizeObserver = new ResizeObserver(updateWidth);
        const currentContRef = containerRef.current;
        resizeObserver.observe(currentContRef);

        return () => {
            if (currentContRef) {
                resizeObserver.unobserve(currentContRef);
            }
        };
    }, []);

    useEffect(() => {
        surveyEngine.onQuestionDisplayed(renderedItemInfos.key.fullKey);
    }, [surveyEngine, renderedItemInfos]);

    const contextValue: SurveyItemContextValue = {
        item: survey.surveyItems[renderedItemInfos.key.fullKey],
        renderedItemInfos,
        itemTranslations: survey.getItemTranslations(renderedItemInfos.key.fullKey),
        headerId: `${renderedItemInfos.key.fullKey}-header`,
        width: width || 0,
        currentResponse,
        setResponse: (response?: ResponseItem) => {
            surveyEngine.setResponse(renderedItemInfos.key.fullKey, response);
            setCurrentResponse(surveyEngine.getResponseItem(renderedItemInfos.key.fullKey)?.response);
        },
    };

    return <SurveyItemContext.Provider value={contextValue}>
        <div
            className='@container'
            ref={containerRef}
        >
            {children}
        </div>
    </SurveyItemContext.Provider>
}

export const useSurveyItemCtx = () => {
    const context = useContext(SurveyItemContext);
    if (!context) {
        throw new Error('useSurveyItemCtx must be used within a SurveyItemContextProvider');
    }
    return context;
};
