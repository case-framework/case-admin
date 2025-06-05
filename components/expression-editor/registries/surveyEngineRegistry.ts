import { ExpressionDef, SlotInputDef } from "../utils";
import { comparisonOperators, logicalOperators, miscExpressions } from "./common";

export const surveyExpressionCategories = [
    {
        id: 'variables',
        label: 'Variables'
    },
    {
        id: 'logical',
        label: 'Logical operators'
    },
    {
        id: 'comparison',
        label: 'Comparison'
    },
    {
        id: 'participant-flags',
        label: 'Participant flags'
    },
    {
        id: 'response-dependencies',
        label: 'Response dependencies'
    },
    {
        id: 'misc',
        label: 'Misc'
    },
    {
        id: 'advanced',
        label: 'Advanced'
    },
    {
        id: 'templates',
        label: 'Templates'
    }
]

const slotKeyValueListSlotEditors: SlotInputDef[] = [
    {
        id: 'item-key-slot-key-options-single-choice',
        type: 'key-value-list',
        label: 'Single choice options',
        contextArrayKey: 'singleChoiceOptions',
        // filterForItemType: 'with-value',
        withFixedValue: 'rg.scg',
        icon: 'diamond',
        // color: 'green',
        categories: ['variables'],
    },
    {
        id: 'item-key-slot-key-options-multiple-choice',
        type: 'key-value-list',
        label: 'Multiple choice options',
        contextArrayKey: 'multipleChoiceOptions',
        withFixedValue: 'rg.mcg',
        icon: 'square',
        //color: 'green',
        categories: ['variables'],
    },
    {
        id: 'item-key-slot-key-options-generic',
        type: 'key-value-list',
        label: 'Generic item, slot and option keys',
        contextArrayKey: 'allItemKeys',
        icon: 'triangle',
        // color: 'green',
        categories: ['variables'],
    },
]

export const supportedBuiltInSlotTypes: SlotInputDef[] = [
    {
        id: 'text-input',
        type: 'str',
        icon: 'form-input',
        label: 'Text input',
        categories: ['variables'],
    },
    {
        id: 'number-input',
        type: 'num',
        icon: 'form-input',
        label: 'Number input',
        categories: ['variables'],
    },
    {
        id: 'date-picker',
        type: 'date',
        icon: 'calendar',
        label: 'Date picker',
        color: 'lime',
        categories: ['variables'],
    },
    {
        id: 'time-delta-picker',
        type: 'time-delta',
        icon: "circle-slash",
        label: 'Time delta picker',
        color: 'lime',
        categories: ['variables'],
    },
    {
        id: 'participant-flag-selector',
        type: 'key-value',
        contextObjectKey: 'participantFlags',
        // filterForObjectType: 'test1',
        label: 'Available participant flags',
        icon: 'tag',
        color: 'green',
        categories: ['variables'],
    },
    {
        id: 'item-keys',
        type: 'list-selector',
        contextArrayKey: 'allItemKeys',
        label: 'Available item keys',
        icon: 'tag',
        // color: 'green',
        categories: ['variables'],
    },
    {
        id: 'date-unit-picker',
        type: 'list-selector',
        contextArrayKey: 'dateUnitPicker',
        label: 'Date unit picker',
        icon: 'calendar',
        // color: 'green',
        categories: ['variables'],
    },
    ...slotKeyValueListSlotEditors
]

const advancedExpressions: ExpressionDef[] = [
    {
        id: 'isDefined',
        categories: ['advanced'],
        label: 'Is value defined',
        returnType: 'boolean',
        icon: 'package-check',
        color: 'teal',
        slots: [
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str', 'num', 'boolean']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'isDefined',
                data: []
            }
        }
    },

    {
        id: 'getAttribute',
        categories: ['advanced'],
        label: 'Get attribute',
        returnType: 'str',
        icon: 'blocks',
        slots: [
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['object', 'str']
                    }
                ]
            },
            {
                label: 'Attribute',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getAttribute',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: ''
                    }
                ]
            }
        }
    },
    {
        id: 'getContext',
        categories: ['advanced'],
        label: 'Get context',
        returnType: 'object',
        icon: 'blocks',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getContext',
                data: []
            }
        }
    },

    {
        id: 'isLoggedIn',
        categories: ['advanced'],
        label: 'Is user logged in',
        returnType: 'boolean',
        icon: 'user-check',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'and',
                data: [
                    {
                        dtype: 'exp',
                        exp: {
                            name: 'isDefined',
                            data: [
                                {
                                    dtype: 'exp',
                                    exp: {
                                        name: 'getAttribute',
                                        data: [
                                            {
                                                dtype: 'exp',
                                                exp: {
                                                    name: 'getContext',
                                                }
                                            },
                                            {
                                                dtype: 'str',
                                                str: 'isLoggedIn'
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        dtype: 'exp',
                        exp: {
                            name: 'getAttribute',
                            data: [
                                {
                                    dtype: 'exp',
                                    exp: {
                                        name: 'getContext',
                                    }
                                },
                                {
                                    dtype: 'str',
                                    str: 'isLoggedIn'
                                }
                            ]
                        }
                    }
                ]
            }
        },
        isTemplateFor: 'and'
    }
]


const responseDependencies: ExpressionDef[] = [
    {
        id: 'hasResponse',
        label: 'A specific response is present',
        returnType: 'boolean',
        color: 'yellow',
        icon: 'circle-check-big',
        slots: [
            {
                label: 'Item key',
                required: true,
                allowedTypes: [
                    { id: 'item-keys', type: 'list-selector' },
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'] }
                ],
            },
            {
                label: 'Response slot key',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'] }
                ],
            }
        ],
        categories: ['response-dependencies'],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasResponse',
                data: [
                    {
                        dtype: 'str',
                        str: '',
                    },
                    {
                        dtype: 'str',
                        str: 'rg.',
                    },
                ]
            }
        }
    },
    {
        categories: ['response-dependencies'],
        id: 'responseHasKeysAny',
        label: 'Response contains any of these keys',
        returnType: 'boolean',
        color: 'yellow',
        icon: 'copy-plus',
        slots: [
            {
                label: 'Item and option references:',
                required: true,
                allowedTypes: [
                    {
                        id: 'item-key-slot-key-options-generic',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-slot-key-options-multiple-choice',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-slot-key-options-single-choice',
                        type: 'key-value-list',
                    }
                ]
            },

        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'responseHasKeysAny',
                data: []
            }
        }
    },
    {
        categories: ['response-dependencies'],
        id: 'responseHasKeysAll',
        label: 'Response contains all of these keys',
        returnType: 'boolean',
        icon: 'copy-check',
        slots: [
            {
                label: 'Item and option references:',
                required: true,
                allowedTypes: [
                    {
                        id: 'item-key-slot-key-options-generic',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-slot-key-options-multiple-choice',
                        type: 'key-value-list',
                    }
                ]
            },

        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'responseHasKeysAll',
                data: []
            }
        }
    },
    {
        categories: ['response-dependencies'],
        id: 'responseHasOnlyKeysOtherThan',
        label: 'Has response but none of these keys:',
        returnType: 'boolean',
        color: 'yellow',
        icon: 'copy-x',
        slots: [
            {
                label: 'Item and option references:',
                required: true,
                allowedTypes: [
                    {
                        id: 'item-key-slot-key-options-generic',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-slot-key-options-multiple-choice',
                        type: 'key-value-list',
                    },
                    {
                        id: 'item-key-slot-key-options-single-choice',
                        type: 'key-value-list',
                    }

                ]
            },
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'responseHasOnlyKeysOtherThan',
                data: []
            }
        }
    },

    {
        id: 'getResponseValueAsNum',
        categories: ['response-dependencies'],
        label: 'Get response value as number',
        returnType: 'num',
        color: 'lime',
        icon: 'function',
        slots: [
            {
                label: 'Item key',
                required: true,
                allowedTypes: [
                    { id: 'item-keys', type: 'list-selector' },
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            },
            {
                label: 'Response slot key',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getResponseValueAsNum',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.',
                    },
                ],
                returnType: 'float'
            }
        }
    },

    {
        id: 'getResponseValueAsStr',
        categories: ['response-dependencies'],
        label: 'Get response value as string',
        returnType: 'str',
        icon: 'function',
        slots: [
            {
                label: 'Item key',
                required: true,
                allowedTypes: [
                    { id: 'item-keys', type: 'list-selector' },
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            },
            {
                label: 'Response slot key',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getResponseValueAsStr',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.',
                    },
                ],
                returnType: 'str'
            }
        }
    },

    {
        id: 'countResponseItems',
        categories: ['response-dependencies'],
        label: 'Count response items',
        returnType: 'num',
        color: 'lime',
        icon: 'function',
        slots: [
            {
                label: 'Item key',
                required: true,
                allowedTypes: [
                    { id: 'item-keys', type: 'list-selector' },
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            },
            {
                label: 'Response slot key',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'countResponseItems',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.',
                    },
                ]
            }
        }
    },

    {
        id: 'checkResponseValueWithRegex',
        categories: ['response-dependencies'],
        label: 'Check response value with regex',
        returnType: 'boolean',
        color: 'yellow',
        icon: 'regex',
        slots: [
            {
                label: 'Item key',
                required: true,
                allowedTypes: [
                    { id: 'item-keys', type: 'list-selector' },
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            },
            {
                label: 'Response slot key',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            },
            {
                label: 'Regex pattern',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                    { id: 'exp-slot', type: 'expression', allowedExpressionTypes: ['str'], excludedExpressions: ['getAttribute'] }
                ],
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'checkResponseValueWithRegex',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.',
                    },
                    {
                        dtype: 'str',
                        str: '',
                    },
                ]
            }
        }
    },

    {
        id: 'dateResponseDiffFromNow',
        categories: ['response-dependencies'],
        label: 'Get date response diff from now',
        returnType: 'num',
        icon: 'function',
        slots: [
            {
                label: 'Item key',
                required: true,
                allowedTypes: [
                    { id: 'item-keys', type: 'list-selector' },
                    { id: 'text-input', type: 'str', },
                ]
            },
            {
                label: 'Response slot key',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                ]
            },
            {
                label: 'Date unit',
                required: true,
                allowedTypes: [
                    { id: 'date-unit-picker', type: 'list-selector' },
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'dateResponseDiffFromNow',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.',
                    },
                    {
                        dtype: 'str',
                        str: 'days',
                    }
                ]
            }
        }
    },
]

const templates: ExpressionDef[] = [
    {
        categories: ['templates'],
        id: 'consent-given',
        label: 'Consent question accepted',
        returnType: 'boolean',
        icon: 'clipboard-check',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasResponse',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                    {
                        dtype: 'str',
                        str: 'rg.con'
                    }
                ]
            }
        },
        isTemplateFor: 'hasResponse'
    },

    {
        categories: ['templates'],
        id: 'singleChoiceGetNumOptionValue',
        label: 'Single choice get numeric or date option value',
        returnType: 'num',
        icon: 'function',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getResponseValueAsNum',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.scg.'
                    }
                ],
                metadata: {
                    slotTypes: ['item-keys', 'text-input']
                }
            },
        },
        isTemplateFor: 'getResponseValueAsNum',
    },

    {
        categories: ['templates'],
        id: 'multipleChoiceGetNumOptionValue',
        label: 'Multiple choice get numeric or date option value',
        returnType: 'num',
        icon: 'function',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getResponseValueAsNum',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.mcg.'
                    }
                ],
                metadata: {
                    slotTypes: ['item-keys', 'text-input']
                }
            },
        },
        isTemplateFor: 'getResponseValueAsNum',
    },

    {
        categories: ['templates'],
        id: 'multipleChoiceSelectionCount',
        label: 'Count number of selected options in multiple choice',
        returnType: 'num',
        icon: 'function',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'countResponseItems',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.mcg'
                    }
                ],
                metadata: {
                    slotTypes: ['item-keys', 'text-input']
                }
            },
        },
        isTemplateFor: 'countResponseItems',
    },

    {
        categories: ['templates'],
        id: 'datePickerResponseValue',
        label: 'Get date picker response value',
        returnType: 'num',
        icon: 'function',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getResponseValueAsNum',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: 'rg.date'
                    }
                ],
                metadata: {
                    slotTypes: ['item-keys', 'text-input']
                }
            },
        },
        isTemplateFor: 'getResponseValueAsNum',
    }
]

const participantFlags: ExpressionDef[] = [
    {
        categories: ['participant-flags'],
        id: 'hasParticipantFlagKey',
        label: 'Participant flag with key exists',
        returnType: 'boolean',
        icon: 'tag',
        color: 'dark',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            },

        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasParticipantFlagKey',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    }
                ]
            }
        }
    },

    {
        categories: ['participant-flags'],
        id: 'hasParticipantFlagKeyAndValue',
        label: 'Participant flag with key and value exists',
        returnType: 'boolean',
        icon: 'tags',
        color: 'dark',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            },
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'hasParticipantFlagKeyAndValue',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    },
                    {
                        dtype: 'str',
                        str: ''
                    }
                ]
            }
        }
    },

    {
        categories: ['participant-flags'],
        id: 'getParticipantFlagValue',
        label: 'Get participant flag value',
        returnType: 'str',
        icon: 'tag',
        color: 'dark',
        slots: [
            {
                label: 'Key',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    }
                ]
            },

        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getParticipantFlagValue',
                data: [
                    {
                        dtype: 'str',
                        str: ''
                    }
                ]
            }
        }
    },

    {
        categories: ['participant-flags'],
        id: 'parseParticipantFlagAsNum',
        label: 'Parse participant flag as number',
        returnType: 'num',
        icon: 'tag',
        slots: [],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'parseValueAsNum',
                data: [
                    {
                        dtype: 'exp',
                        exp: {
                            name: 'getParticipantFlagValue',
                            data: [
                                {
                                    dtype: 'str',
                                    str: ''
                                }
                            ]
                        }
                    }
                ],
            }
        },
        isTemplateFor: 'parseValueAsNum',
    }
]

export const surveyEngineRegistry: ExpressionDef[] = [
    ...logicalOperators,
    ...miscExpressions,
    ...responseDependencies,
    ...templates,
    ...comparisonOperators,
    ...advancedExpressions,
    ...participantFlags,
    {
        categories: ['response-dependencies'],
        id: 'getSurveyItemValidation',
        label: 'Is survey item validation true',
        returnType: 'boolean',
        icon: 'badge-check',
        color: 'cyan',
        slots: [
            {
                label: 'Item key',
                required: true,
                allowedTypes: [
                    { id: 'item-keys', type: 'list-selector' },
                    { id: 'text-input', type: 'str', },
                ],
            },
            {
                label: 'Validation key',
                required: true,
                allowedTypes: [
                    { id: 'text-input', type: 'str', },
                ],
            },
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'getSurveyItemValidation',
                data: [
                    undefined,
                    {
                        dtype: 'str',
                        str: '',
                    },
                ]
            }
        }
    }
]
