import { Editor } from '@monaco-editor/react';
import { Button, Tooltip } from '@nextui-org/react';
import React from 'react';
import { BsCheck2, BsExclamationTriangleFill, BsX } from 'react-icons/bs';
import * as yaml from 'js-yaml';
import { Expression, ExpressionArg } from 'survey-engine/data_types';

interface MonacoExpressionEditorProps {
    expression?: Expression;
    onChange: (expression: Expression) => void;
}

const supportedExpressionNames = [
    'responseHasKeysAny',
]

const checkExpression = (expression: any): boolean => {
    if (!expression) return false;
    if (typeof expression !== 'object') return false;
    if (!expression.name) return false;
    if (!expression.data) return false;

    const argsOk = expression.data.every((d: ExpressionArg) => {
        if (!d) return false;
        if (typeof d !== 'object') return false;
        if (!d.dtype && d.str) return true;
        if (!d.dtype) return false;
        if (d.dtype === 'exp') {
            return checkExpression(d.exp);
        }
        return true;
    });
    if (!argsOk) return false;
    return true;
}


const MonacoExpressionEditor: React.FC<MonacoExpressionEditorProps> = (props) => {
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [editorContent, setEditorContent] = React.useState<string | undefined>(undefined);
    const [contentAsExpression, setContentAsExpression] = React.useState<Expression | undefined>(undefined);

    const expressionAsYaml = React.useMemo(() => {
        setContentAsExpression(props.expression);
        return yaml.dump(props.expression);
    }, [props.expression]);


    React.useEffect(() => {
        setEditorContent(expressionAsYaml);
    }, [expressionAsYaml]);


    return (
        <div>
            <div className='flex items-center gap-unit-sm bg-content3 px-unit-sm py-2 rounded-small mb-unit-sm'>
                <span>
                    <BsExclamationTriangleFill className='text-default-500' />
                </span>
                <span className='text-small'>
                    This is a temporary editor UI for expressions where you can use YAML format to edit the raw data stored in the model.
                </span>
            </div>

            <div className='overflow-hidden border p rounded-medium relative'>
                <p className="text-tiny px-3 py-2">Expression (in YAML format)</p>
                <Editor
                    height="250px" defaultLanguage="yaml"
                    value={editorContent}
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        roundedSelection: true,
                    }}

                    beforeMount={(monaco) => {
                        function createDependencyProposals(range: any) {
                            return supportedExpressionNames.map((name) => {
                                return {
                                    label: name,
                                    kind: monaco.languages.CompletionItemKind.Text,
                                    insertText: name,
                                    range: range,
                                };
                            });

                        }

                        monaco.languages.registerCompletionItemProvider("yaml", {
                            provideCompletionItems: function (model: any, position: any) {
                                // find out if we are completing a property for the 'name'
                                var textUntilPosition = model.getValueInRange({
                                    startLineNumber: position.lineNumber,
                                    startColumn: 1,
                                    endLineNumber: position.lineNumber,
                                    endColumn: position.column,
                                });
                                var match = textUntilPosition.match(/\s*name:/);
                                if (!match) {
                                    return { suggestions: [] };
                                }
                                var word = model.getWordUntilPosition(position);
                                var range = {
                                    startLineNumber: position.lineNumber,
                                    endLineNumber: position.lineNumber,
                                    startColumn: word.startColumn,
                                    endColumn: word.endColumn,
                                };
                                return {
                                    suggestions: createDependencyProposals(range),
                                };
                            },
                        });
                    }}
                    language='yaml'
                    onChange={(e) => {
                        setEditorContent(e);
                        if (!e) return;
                        try {
                            yaml.loadAll(e, (doc) => {
                                if (doc) {
                                    const expression = doc as Expression;
                                    if (!checkExpression(expression)) {
                                        setContentAsExpression(undefined);
                                        setErrorMsg('please check the syntax of the expression');
                                        return;
                                    }
                                    setContentAsExpression(doc as Expression);
                                    setErrorMsg(undefined);
                                }
                            })
                        } catch (e) {
                            console.log(e);
                            setContentAsExpression(undefined);
                            setErrorMsg('please check the syntax of the expression');
                        }
                    }}
                />
                {errorMsg && <p className='absolute bottom-0 bg-red-50/80 w-full text-center text-danger-500 text-sm py-1 px-unit-md font-bold'>{errorMsg}</p>}
            </div>
            {editorContent !== expressionAsYaml &&
                <div className='flex justify-end'>
                    <Tooltip content='Discard changes'>
                        <Button
                            isIconOnly={true}
                            size='sm'
                            variant='light'
                            color='danger'
                            className='text-2xl'
                            onPress={() => {
                                if (confirm('Are you sure you want to discard the changes?')) {
                                    setEditorContent(expressionAsYaml);
                                    setErrorMsg(undefined);
                                }
                            }}
                        >
                            <BsX />
                        </Button>
                    </Tooltip>
                    <Tooltip content='Accept changes'>
                        <Button
                            isIconOnly={true}
                            size='sm'
                            variant='light'
                            color='success'
                            className='text-2xl'
                            isDisabled={!contentAsExpression}
                            onPress={() => {
                                if (contentAsExpression) {
                                    props.onChange(contentAsExpression);
                                }
                            }}
                        >
                            <BsCheck2 />
                        </Button>
                    </Tooltip>
                </div>
            }
        </div>

    );
};

export default MonacoExpressionEditor;
