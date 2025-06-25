import { ItemComponent, Survey } from "survey-engine/data_types";
import { compileSurvey, isSurveyCompiled } from "survey-engine/survey-compilation";


export const getAvailableTranslationsForComponent = (component: ItemComponent): string[] => {
    if (!component.translations) return [];
    return Object.keys(component.translations);
}

export const checkMissingTranslations = (component: ItemComponent): string[] => {
    const expectedLanguages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : ['en'];
    const availableTranslations = getAvailableTranslationsForComponent(component);

    const contentKeys = component.content?.map(c => c.key);

    if (!contentKeys) return [];

    const missingLanguages = expectedLanguages.filter(lang => {
        const t = availableTranslations.includes(lang);
        if (!t) return true;

        return contentKeys.some(key => {
            const translation = component.translations?.[lang]?.[key];
            return translation === undefined || translation === '';
        });
    })

    return missingLanguages;
}


export const findAllLocales = (survey: Survey): string[] => {
    if (!isSurveyCompiled(survey)) {
        survey = compileSurvey(survey);
    }

    const locales: string[] = [];
    if (survey.translations) {
        Object.keys(survey.translations).forEach(lang => {
            locales.push(lang);
        });
    }

    return locales;
}


export const removeLocales = (survey: Survey, locales: string[]): Survey => {
    const newSurvey = { ...survey };
    throw new Error('Not implemented');
    /*if (newSurvey.props?.name) {
        newSurvey.props.name = removeLocaleFromLocString(newSurvey.props.name, locales);
    }
    if (newSurvey.props?.description) {
        newSurvey.props.description = removeLocaleFromLocString(newSurvey.props.description, locales);
    }
    if (newSurvey.props?.typicalDuration) {
        newSurvey.props.typicalDuration = removeLocaleFromLocString(newSurvey.props.typicalDuration, locales);
    }

    newSurvey.surveyDefinition = removeLocalesInSurveyItem(newSurvey.surveyDefinition, locales) as SurveyGroupItem;
    return newSurvey;*/
}


export const renameLocales = (survey: Survey, oldLoc: string, newLoc: string): Survey => {
    throw new Error('Not implemented');
    /*const surveyJSON = JSON.stringify(survey);
    const newSurveyJSON = surveyJSON.replaceAll(
        `"${oldLoc}"`,
        `"${newLoc}"`
    );
    const newSurvey = JSON.parse(newSurveyJSON) as Survey;
    return newSurvey;*/
}

