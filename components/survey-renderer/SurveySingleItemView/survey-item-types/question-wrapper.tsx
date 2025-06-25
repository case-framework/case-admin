import { QuestionItem } from "survey-engine";
import { useSurveyCtx } from "../../survey-context";
import { useSurveyItemCtx } from "../survey-item-context";
import { Separator } from "@/components/ui/separator";

interface QuestionWrapperProps {
    children: React.ReactNode;
}

const QuestionWrapper: React.FC<QuestionWrapperProps> = ({ children }) => {

    const { item } = useSurveyItemCtx();
    const { survey, locale } = useSurveyCtx();

    const questionItem = item as QuestionItem;

    const itemTranslations = survey.getItemTranslations(item.key.fullKey);

    const fallbackLocale = 'en';

    // TODO: look up content for slot with fallback
    const titleContent = itemTranslations?.getContent(locale, 'title', fallbackLocale);
    const subtitleContent = itemTranslations?.getContent(locale, 'subtitle', fallbackLocale);

    const hasHeader = questionItem.header?.helpPopover !== undefined || questionItem.header?.title !== undefined || questionItem.header?.subtitle !== undefined;
    const hasTitle = questionItem.header?.title !== undefined;
    const hasSubtitle = questionItem.header?.subtitle !== undefined;

    // console.log(questionItem)
    // console.log(hasHeader, hasTitle, hasSubtitle);
    // TODO: render text / markdown or attributed text


    // survey.translations?.[locale]?.[item.key.fullKey]?.['title']
    //(item as QuestionItem).header?.title?.styles


    return <div className="flex flex-col gap-6">
        {hasHeader && <><div>
            {hasTitle && <p className="text-lg font-bold tracking-wide">{titleContent?.content}</p>}
            {hasSubtitle && <p className="text-sm text-foreground tracking-wide">
                {subtitleContent?.content}
            </p>}
        </div>
            <Separator />
        </>}
        {children}
    </div>
}

export default QuestionWrapper;