import { LocalizedString } from 'survey-engine/data_types';

export interface SurveyInfos {
    infos: Array<{
        surveyKey: string;
        studyKey: string;
        name: LocalizedString;
        description: LocalizedString;
        typicalDuration: LocalizedString;
    }>
}
