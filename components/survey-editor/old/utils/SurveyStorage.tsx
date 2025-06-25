import { Survey } from "survey-engine/data_types";

export class SurveyStorage {
    public static debug = false;
    public static maxStoredSurveys = 8;
    storedSurveys: StoredSurvey[] = [];
    public asObject = () => { return { storedSurveys: this.storedSurveys } };

    constructor(json?: string) {
        if (json) {
            if (SurveyStorage.debug) {
                console.log('Constructing SurveyStorage from string.');
            }
            this.storedSurveys = [];
            try {
                const parsed = JSON.parse(json);
                if (parsed.storedSurveys) {
                    this.storedSurveys = parsed.storedSurveys.map((s: {
                        id: string;
                        survey: Survey;
                        date: string;
                    }) => new StoredSurvey(s.id, s.survey, new Date(s.date)));
                }
            } catch (error) {
                console.error('Error parsing SurveyStorage:', error);
            }
        }
    }

    applyLimit = () => {
        if (this.storedSurveys.length > SurveyStorage.maxStoredSurveys) {
            this.storedSurveys.sort((a, b) => a.lastUpdated.getTime() - b.lastUpdated.getTime());
            this.storedSurveys.reverse();
            this.storedSurveys = this.storedSurveys.slice(0, SurveyStorage.maxStoredSurveys);
        }
    }

    updateSurvey = (updatedStoredSurvey: StoredSurvey) => {
        if (SurveyStorage.debug) { console.log('Updating survey in storage with id:', updatedStoredSurvey.id); }
        this.storedSurveys = this.storedSurveys.filter(s => s.id !== updatedStoredSurvey.id);
        this.storedSurveys.push(updatedStoredSurvey);
        this.applyLimit();
    }

    public getRecentlyEditedSurveys = (): StoredSurvey[] => {
        const sortedSurveys = this.storedSurveys.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        return sortedSurveys;
    }

    public getMostRecentlyEditedSurvey = (): StoredSurvey | undefined => {
        const res = this.getRecentlyEditedSurveys();
        return res.length > 0 ? res[0] : undefined;
    }

    public removeSurvey = (storedSurvey: StoredSurvey) => {
        if (SurveyStorage.debug) { console.log('Removing survey in storage with id:', storedSurvey.id); }
        this.storedSurveys = this.storedSurveys.filter(s => s.id !== storedSurvey.id);
    }
}

export class StoredSurvey {
    id: string;
    survey: Survey;
    lastUpdated: Date;

    constructor(id: string, survey: Survey, date: Date) {
        this.survey = survey;
        this.lastUpdated = date;
        this.id = id;
    }

    toJSON = (): unknown => {
        return {
            id: this.id,
            survey: this.survey,
            date: this.lastUpdated.toISOString(),
        };
    }
}
