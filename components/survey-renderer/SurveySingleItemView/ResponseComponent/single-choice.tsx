import React from "react";
import { ResponseItem, ScgMcgChoiceResponseConfig } from "survey-engine";
import { useSurveyItemCtx } from "../survey-item-context";
import { useSurveyCtx } from "../../survey-context";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoIcon } from "lucide-react";


interface SingleChoiceProps {
    responseConfig: ScgMcgChoiceResponseConfig;
}

const SingleChoice: React.FC<SingleChoiceProps> = ({ responseConfig }) => {
    const { itemTranslations, currentResponse, setResponse, renderedItemInfos, } = useSurveyItemCtx();
    const { locale, surveyEngine } = useSurveyCtx();

    console.log('-----')
    return <div
        className=""
    >
        <div className="p-4  border border-primary/30 rounded-xl mb-4">
            <p className="text-sm flex items-center gap-2">
                <span className="text-primary">
                    <InfoIcon className="size-4" />
                </span>
                <span>
                    Select one option
                </span>
            </p>
        </div>
        {renderedItemInfos.responseCompOrder?.map((option) => {
            const optionItem = responseConfig.items.find((o) => o.key.fullKey === option);
            if (!optionItem) return null;

            const disabled = surveyEngine.getDisabledConditionValue(optionItem.key.parentItemKey.fullKey, optionItem.key.fullKey);

            console.log(optionItem.key.fullKey, 'disabled', disabled);

            return (
                <div key={optionItem.key.fullKey}>
                    <p className="flex items-center gap-4 hover:bg-gray-50 rounded-lg -mx-3 py-3 px-3 cursor-pointer">
                        <span className="text-xs text-gray-500 px-3 py-1 bg-gray-50 rounded-full">
                            {optionItem.key.fullKey}
                        </span>
                        <Checkbox className="size-5"
                            checked={currentResponse?.get() === optionItem.key.componentKey}
                            onCheckedChange={() => {
                                if (!currentResponse) {
                                    setResponse(new ResponseItem(optionItem.key.componentKey));
                                } else {
                                    currentResponse.setValue(optionItem.key.componentKey);
                                    setResponse(currentResponse.clone());
                                }
                            }}
                        />
                        <span>
                            {itemTranslations?.getContent(locale, optionItem.key.fullKey, 'en')?.content}
                        </span>
                    </p>
                </div>
            )
        })}
    </div>
}

export default SingleChoice;
