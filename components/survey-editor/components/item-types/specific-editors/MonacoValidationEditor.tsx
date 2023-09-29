import { Editor } from '@monaco-editor/react';
import { Button, Tooltip } from '@nextui-org/react';
import React from 'react';
import { BsCheck2, BsExclamationTriangleFill, BsX } from 'react-icons/bs';
import * as yaml from 'js-yaml';
import { Validation } from 'survey-engine/data_types';


interface MonacoValidationEditorProps {
    validations?: Validation[];
    onChange: (validations: Validation[] | undefined) => void;
}


const MonacoValidationEditor: React.FC<MonacoValidationEditorProps> = (props) => {
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [editorContent, setEditorContent] = React.useState<string | undefined>(undefined);
    const [contentAsValidations, setContentAsValidations] = React.useState<Validation[] | undefined>(undefined);

    const validationsAsYaml = React.useMemo(() => {
        setContentAsValidations(props.validations);
        return yaml.dump(props.validations);
    }, [props.validations]);


    React.useEffect(() => {
        setEditorContent(validationsAsYaml);
    }, [validationsAsYaml]);


    return (
        <div>
            <div className='flex items-center gap-unit-sm bg-content3 px-unit-sm py-2 rounded-small mb-unit-sm'>
                <span>
                    <BsExclamationTriangleFill className='text-default-500' />
                </span>
                <span className='text-small'>
                    This is a temporary editor UI for validations where you can use YAML format to edit the raw data stored in the model.
                </span>
            </div>

            <div className='overflow-hidden border p rounded-medium relative'>
                <p className="text-tiny px-3 py-2">Custom validations (in YAML format)</p>
                <Editor
                    height="250px" defaultLanguage="yaml"
                    value={editorContent}
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        roundedSelection: true,
                    }}
                    language='yaml'
                    onChange={(e) => {
                        setEditorContent(e);
                        if (!e) return;
                        try {
                            yaml.loadAll(e, (doc) => {
                                if (doc) {
                                    setContentAsValidations(doc as Validation[]);
                                    setErrorMsg(undefined);
                                }
                            })
                        } catch (e) {
                            console.log(e);
                            setContentAsValidations(undefined);
                            setErrorMsg('please check the syntax of the expression');
                        }
                    }}
                />
                {errorMsg && <p className='absolute bottom-0 bg-red-50/80 w-full text-center text-danger-500 text-sm py-1 px-unit-md font-bold'>{errorMsg}</p>}
            </div>
            {editorContent !== validationsAsYaml &&
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
                                    setEditorContent(validationsAsYaml);
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
                            isDisabled={!contentAsValidations}
                            onPress={() => {
                                if (contentAsValidations) {
                                    props.onChange(contentAsValidations);
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

export default MonacoValidationEditor;
