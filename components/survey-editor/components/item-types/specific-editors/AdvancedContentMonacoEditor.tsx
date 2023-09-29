import React from 'react';
import { Editor } from '@monaco-editor/react';
import { Button, Tooltip } from '@nextui-org/react';
import { BsCheck2, BsExclamationTriangleFill, BsX } from 'react-icons/bs';
import { DateDisplayComponentProp, ExpressionDisplayProp, OptionDef, StyledTextComponentProp } from 'case-editor-tools/surveys/types';
import * as yaml from 'js-yaml';

interface AdvancedContentMonacoEditorProps {
    label: string;
    advancedContent: Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp> | Array<OptionDef>
    onChange: (newContent: Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp> | Array<OptionDef>) => void;
}


const AdvancedContentMonacoEditor: React.FC<AdvancedContentMonacoEditorProps> = (props) => {
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [editorContent, setEditorContent] = React.useState<string | undefined>(undefined);
    const [codeAsAdvancedContent, setCodeAsAdvancedContent] = React.useState<Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp> | Array<OptionDef> | undefined>(undefined);

    const contentAsYaml = React.useMemo(() => {
        if (props.advancedContent.length === 0) {
            return '';
        }
        const internalRep = props.advancedContent.map((c: any) => {
            if (c.content !== undefined) {
                return {
                    className: c.className,
                    content: Array.from(c.content.entries()),
                }
            }
            if (c.date !== undefined) {
                return c
            }
            if (c.expression !== undefined) {
                return c
            }
            if (c.role !== undefined) {
                return {
                    ...c,
                    content: Array.from(c.content.entries()),
                }
            }
            return undefined;
        });
        setCodeAsAdvancedContent(props.advancedContent);
        return yaml.dump(internalRep);
    }, [props.advancedContent]);


    React.useEffect(() => {
        setEditorContent(contentAsYaml);
    }, [contentAsYaml]);


    return (
        <div>
            <div className='flex items-center gap-unit-sm bg-content2 px-unit-sm py-2 rounded-small mb-unit-sm'>
                <span>
                    <BsExclamationTriangleFill className='text-default-500' />
                </span>
                <span className='text-small'>
                    This is a temporary editor UI for advanced content editor where you can provide the content in YAML format.
                </span>
            </div>

            <div className='overflow-hidden border p rounded-medium relative'>
                <p className="text-tiny px-3 py-2">
                    {props.label}
                </p>
                <Editor height="250px" defaultLanguage="yaml"
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        roundedSelection: true,
                    }}
                    language='yaml'
                    value={editorContent}
                    onChange={(e) => {
                        setEditorContent(e);
                        if (!e) return;
                        try {
                            yaml.loadAll(e, (doc) => {
                                if (doc) {
                                    const content = doc as Array<StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp> | Array<OptionDef>;
                                    if (!content || !Array.isArray(content)) {
                                        setErrorMsg('please check the syntax of the content');
                                        return
                                    }
                                    const mappedContent = content.map((c: any) => {
                                        if (!c) {
                                            throw new Error('Invalid content');
                                        }
                                        if (c.content !== undefined && Array.isArray(c.content)) {
                                            c.content = new Map(c.content);
                                        }
                                        return c;
                                    });
                                    setCodeAsAdvancedContent(mappedContent);
                                    setErrorMsg(undefined);
                                }
                            })
                        } catch (e) {
                            console.log(e);
                            setCodeAsAdvancedContent(undefined);
                            setErrorMsg('please check the syntax of the content');
                        }
                    }}
                />
                {errorMsg && <p className='absolute bottom-0 bg-red-50/80 w-full text-center text-danger-500 text-sm py-1 px-unit-md font-bold'>{errorMsg}</p>}
            </div>
            {editorContent !== contentAsYaml &&
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
                                    setEditorContent(contentAsYaml);
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
                            isDisabled={!codeAsAdvancedContent}
                            onPress={() => {
                                if (codeAsAdvancedContent) {
                                    props.onChange(codeAsAdvancedContent);
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

export default AdvancedContentMonacoEditor;
