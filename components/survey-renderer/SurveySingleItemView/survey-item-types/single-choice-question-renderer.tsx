import { SingleChoiceQuestionItem } from "survey-engine";
import { useSurveyItemCtx } from "../survey-item-context";
import QuestionWrapper from "./question-wrapper";
import SingleChoice from "../ResponseComponent/single-choice";



const SingleChoiceQuestionRenderer: React.FC = () => {
    const { item } = useSurveyItemCtx();
    const singleChoiceQuestionItem = item as SingleChoiceQuestionItem;

    return <QuestionWrapper>
        <SingleChoice responseConfig={singleChoiceQuestionItem.responseConfig} />
    </QuestionWrapper>
}

export default SingleChoiceQuestionRenderer;
