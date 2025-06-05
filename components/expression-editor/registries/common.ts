import { ExpressionDef } from "../utils";

export const miscExpressions: ExpressionDef[] = [
    {
        categories: ['misc'],
        id: 'timestampWithOffset',
        label: 'GET TIMESTAMP',
        returnType: 'num',
        icon: 'calendar',
        color: 'lime',
        slots: [
            {
                label: 'Offset',
                required: true,
                allowedTypes: [
                    {
                        id: 'time-delta-picker',
                        type: 'time-delta',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num'],
                        excludedExpressions: ['timestampWithOffset']
                    }
                ]
            },
            {
                label: 'Reference date',
                required: false,
                allowedTypes: [
                    {
                        id: 'date-picker',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'timestampWithOffset',
                data: [
                    {
                        dtype: 'num',
                        num: 0
                    }
                ],
                metadata: {
                    slotTypes: ['time-delta-picker']
                }
            }
        }
    },

    {
        id: 'parseValueAsNum',
        categories: ['misc'],
        label: 'Parse value as number',
        returnType: 'num',
        icon: 'function',
        color: 'lime',
        slots: [
            {
                label: 'Value',
                required: true,
                allowedTypes: [
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['str']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'parseValueAsNum',
                data: [],
                returnType: 'float'
            }
        }
    },
]



export const logicalOperators: ExpressionDef[] = [
    {
        categories: ['logical'],
        id: 'and',
        label: 'and',
        returnType: 'boolean',
        icon: 'ampersands',
        color: 'blue',
        slots: [
            {
                label: 'if all true:',
                required: true,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'and',
                data: []
            }
        }
    },
    {
        categories: ['logical'],
        id: 'or',
        label: 'or',
        returnType: 'boolean',
        icon: 'tally',
        color: 'blue',
        slots: [
            {
                label: 'if any true:',
                required: true,
                isListSlot: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'or',
                data: []
            }
        }
    },
    {
        categories: ['logical'],
        id: 'not',
        label: 'not',
        returnType: 'boolean',
        icon: 'circle-slash',
        color: 'orange',
        slots: [
            {
                label: 'if not true:',
                required: true,
                allowedTypes: [
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['boolean']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'not',
                data: []
            }
        }
    }
]

export const comparisonOperators: ExpressionDef[] = [
    {
        categories: ['comparison'],
        id: 'eq',
        label: 'Equals (L == R)',
        returnType: 'boolean',
        icon: 'equal',
        color: 'teal',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num', 'str']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'text-input',
                        type: 'str',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num', 'str']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'eq',
                data: []
            }
        }
    },
    {
        categories: ['comparison'],
        id: 'lte',
        label: 'Less than or equal (L <= R)',
        returnType: 'boolean',
        icon: 'chevrons-left',
        color: 'teal',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'lte',
                data: [
                    {
                        dtype: 'num',
                        num: 0
                    },
                    {
                        dtype: 'num',
                        num: 1
                    }
                ]
            }
        }
    },
    {
        categories: ['comparison'],
        id: 'lt',
        label: 'Less than (L < R)',
        returnType: 'boolean',
        icon: 'chevron-left',
        color: 'teal',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'lt',
                data: [
                    {
                        dtype: 'num',
                        num: 0
                    },
                    {
                        dtype: 'num',
                        num: 1
                    }
                ]
            }
        }
    },
    {
        categories: ['comparison'],
        id: 'gte',
        label: 'Greater than or equal (L >= R)',
        returnType: 'boolean',
        icon: 'chevrons-right',
        color: 'teal',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'gte',
                data: [
                    {
                        dtype: 'num',
                        num: 1
                    },
                    {
                        dtype: 'num',
                        num: 0
                    }
                ]
            }
        }
    },
    {
        categories: ['comparison'],
        id: 'gt',
        label: 'Greater than (L > R)',
        returnType: 'boolean',
        icon: 'chevron-right',
        color: 'blue',
        slots: [
            {
                label: 'Left side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            },
            {
                label: 'Right side',
                required: true,
                allowedTypes: [
                    {
                        id: 'number-input',
                        type: 'num',
                    },
                    {
                        id: 'date-input',
                        type: 'date',
                    },
                    {
                        id: 'exp-slot',
                        type: 'expression',
                        allowedExpressionTypes: ['num']
                    }
                ]
            }
        ],
        defaultValue: {
            dtype: 'exp',
            exp: {
                name: 'gt',
                data: [
                    {
                        dtype: 'num',
                        num: 1
                    },
                    {
                        dtype: 'num',
                        num: 0
                    }
                ]
            }
        }
    },
]
