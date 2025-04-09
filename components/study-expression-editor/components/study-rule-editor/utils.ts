import { ExpArg, Expression, ExpressionArg, StrArg } from "@/components/expression-editor/utils";


type EventHandlerType = 'ENTER' | 'SUBMIT' | 'TIMER' | 'MERGE' | 'CUSTOM' | 'LEAVE'

export const getEventHandlerByType = (rules: Expression[], type: EventHandlerType): Expression | undefined => {
    const handler = rules.find(rule => {
        if (rule.name !== 'IFTHEN') {
            return false;
        }
        if (rule.data === undefined || rule.data.length === 0) {
            return false;
        }
        const condition = rule.data.at(0) as ExpArg;
        if (condition === undefined) {
            return false;
        }

        return (condition.exp.name === 'checkEventType' && condition.exp.data !== undefined && (condition.exp.data.at(0) as StrArg).str === type);
    });
    return handler;
}

export const initEventHandler = (type: EventHandlerType): Expression => {
    return {
        name: 'IFTHEN',
        data: [
            {
                dtype: 'exp',
                exp: {
                    name: 'checkEventType',
                    data: [
                        {
                            dtype: 'str',
                            str: type
                        }
                    ]
                }
            }
        ]
    } as Expression;
}

export const initSurveySubmissionHandler = (key: string): Expression => {
    return {
        name: 'IFTHEN',
        data: [
            {
                dtype: 'exp',
                exp: {
                    name: 'checkSurveyResponseKey',
                    data: [
                        {
                            dtype: 'str',
                            str: key
                        }
                    ]
                }
            }
        ]
    }
}

export class StudyRulesSet {
    private _entryEventHandler: Expression | undefined;
    private _surveySubmissionHandler: Expression | undefined;
    private _customEventHandler: Expression | undefined;
    private _timerEventHandler: Expression | undefined;
    private _mergeEventHandler: Expression | undefined;
    private _leaveEventHandler: Expression | undefined;


    constructor(rules: Expression[]) {
        this._entryEventHandler = getEventHandlerByType(rules, 'ENTER');
        this._surveySubmissionHandler = getEventHandlerByType(rules, 'SUBMIT');
        this._customEventHandler = getEventHandlerByType(rules, 'CUSTOM');
        this._timerEventHandler = getEventHandlerByType(rules, 'TIMER');
        this._mergeEventHandler = getEventHandlerByType(rules, 'MERGE');
        this._leaveEventHandler = getEventHandlerByType(rules, 'LEAVE');
    }

    updateEntryEventHandler(actions: ExpressionArg[] | undefined) {
        if (actions === undefined || actions.length === 0) {
            this._entryEventHandler = undefined;
            return;
        }
        this._entryEventHandler = initEventHandler('ENTER');
        this._entryEventHandler?.data?.push(...actions);
    }

    updateMergeEventHandler(actions: ExpressionArg[] | undefined) {
        if (actions === undefined || actions.length === 0) {
            this._mergeEventHandler = undefined;
            return;
        }
        this._mergeEventHandler = initEventHandler('MERGE');
        this._mergeEventHandler?.data?.push(...actions);
    }

    upddateLeaveEventHandler(actions: ExpressionArg[] | undefined) {
        if (actions === undefined || actions.length === 0) {
            this._leaveEventHandler = undefined;
            return;
        }
        this._leaveEventHandler = initEventHandler('LEAVE');
        this._leaveEventHandler?.data?.push(...actions);
    }

    updateSurveySubmissionHandler(key: string, actions: ExpressionArg[] | undefined) {
        if (this._surveySubmissionHandler === undefined) {
            this._surveySubmissionHandler = initEventHandler('SUBMIT');
        }
        if (actions === undefined) {
            // remove handler
            const indexToRemove = this._surveySubmissionHandler?.data?.findIndex(h => {
                if (h === undefined) {
                    return false;
                }
                const currentKey = ((h as ExpArg).exp.data?.at(0) as ExpArg).exp.data?.at(0) as StrArg;
                return currentKey.str === key;
            })

            if (indexToRemove !== undefined && indexToRemove > -1) {
                this._surveySubmissionHandler?.data?.splice(indexToRemove, 1);

                const hasNoHandlersLeft = this._surveySubmissionHandler?.data?.length === undefined || this._surveySubmissionHandler?.data?.length < 2;
                if (hasNoHandlersLeft) {
                    this._surveySubmissionHandler = undefined;
                }
            }
        } else {
            // add or update handler
            const indexToUpdate = this._surveySubmissionHandler?.data?.slice(1).findIndex(h => {
                if (h === undefined) {
                    return false;
                }
                console.log(h)
                const currentKey = ((h as ExpArg).exp.data?.at(0) as ExpArg).exp.data?.at(0) as StrArg;
                return currentKey.str === key;
            })

            if (indexToUpdate === -1 || indexToUpdate === undefined) {
                this._surveySubmissionHandler?.data?.push({
                    dtype: 'exp',
                    exp: initSurveySubmissionHandler(key)
                });
            } else {
                this._surveySubmissionHandler?.data?.splice(indexToUpdate, 1, {
                    dtype: 'exp',
                    exp: initSurveySubmissionHandler(key)
                });
            }
        }
    }

    upddateCustomEventHandler(key: string, actions: ExpressionArg[] | undefined) {
        if (actions === undefined) {
            // remove handler

            // if removed last one, set to undefined
        } else {
            // add or update handler
            // if key not used yet, add new with key
        }
    }

    upddateTimerEventHandler(index: number, actions: ExpressionArg[] | undefined) {
        if (actions === undefined) {
            // remove handler

            // if removed last one, set to undefined
        } else {
            // add or update handler
            // if index < 0 add new "DO" handler
        }
    }

    getSurveySubmissionHandlerInfos(): {
        key: string;
        actions: ExpressionArg[];
    }[] {
        const handlers: Array<{
            key: string;
            actions: ExpressionArg[];
        }> = [];

        if (!this._surveySubmissionHandler || this._surveySubmissionHandler.data === undefined || this._surveySubmissionHandler.data.length < 2) {
            return handlers;
        }

        for (let i = 1; i < this._surveySubmissionHandler.data.length; i++) {
            const handler = this._surveySubmissionHandler.data.at(i) as ExpArg;

            const key = (handler.exp.data?.at(0) as ExpArg).exp.data?.at(0) as StrArg;
            if (key.str === undefined) {
                console.error('Invalid key in survey submission handler');
                continue;
            }
            handlers.push({
                key: key.str,
                actions: handler.exp.data?.slice(1) as ExpressionArg[] ?? []
            });
        }

        return handlers;
    }

    getCustomEventHandlerInfos(): {
        key: string;
        actions: ExpressionArg[];
    }[] {
        const handlers: Array<{
            key: string;
            actions: ExpressionArg[];
        }> = [];
        if (!this._customEventHandler || this._customEventHandler.data === undefined || this._customEventHandler.data.length < 2) {
            return handlers;
        }
        for (let i = 1; i < this._customEventHandler.data.length; i++) {
            const handler = this._customEventHandler.data.at(i) as ExpArg;

            const key = (handler.exp.data?.at(0) as ExpArg).exp.data?.at(0) as StrArg;
            if (key.str === undefined) {
                console.error('Invalid key in custom event handler');
                continue;
            }
            handlers.push({
                key: key.str,
                actions: handler.exp.data?.slice(1) as ExpressionArg[] ?? []
            });
        }
        return handlers;
    }

    getTimerEventHandlerInfos(): {
        key: string;
        actions: ExpressionArg[];
    }[] {
        const handlers: Array<{
            key: string;
            actions: ExpressionArg[];
        }> = [];
        if (!this._timerEventHandler || this._timerEventHandler.data === undefined || this._timerEventHandler.data.length < 2) {
            return handlers;
        }
        for (let i = 1; i < this._timerEventHandler.data.length; i++) {
            const handler = this._timerEventHandler.data.at(i) as ExpArg;


            handlers.push({
                key: '',
                actions: handler.exp.data?.slice(1) as ExpressionArg[] ?? []
            });
        }
        return handlers;
    }


    getRules(): Expression[] {
        const rules: Expression[] = [];
        if (this._entryEventHandler) {
            rules.push(this._entryEventHandler);
        }
        if (this._customEventHandler) {
            rules.push(this._customEventHandler);
        }
        if (this._surveySubmissionHandler) {
            rules.push(this._surveySubmissionHandler);
        }
        if (this._timerEventHandler) {
            rules.push(this._timerEventHandler);
        }
        if (this._mergeEventHandler) {
            rules.push(this._mergeEventHandler);
        }
        if (this._leaveEventHandler) {
            rules.push(this._leaveEventHandler);
        }
        return rules;
    }
}
