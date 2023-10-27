import { Expression, LocalizedString } from 'survey-engine/data_types';

export interface SurveyInfos {
    infos: Array<{
        surveyKey: string;
        studyKey: string;
        name: LocalizedString;
        description: LocalizedString;
        typicalDuration: LocalizedString;
    }>
}

export interface StudyProps {
    name: LocalizedString[];
    description: LocalizedString[];
    tags: Array<{ label: LocalizedString[] }>;
    systemDefaultStudy: boolean;
}

export interface Study {
    key: string;
    status: string;
    secretKey: string;
    props: StudyProps;
    configs: {
        idMappingMethod: string;
        participantFileUploadRule: Expression;
    }
    stats: {
        participantCount: number;
        tempParticipantCount: number;
        responseCount: number;
    };
    rules: Expression[];
}
