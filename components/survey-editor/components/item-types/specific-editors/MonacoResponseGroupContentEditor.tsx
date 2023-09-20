import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';
import * as yaml from 'js-yaml';
import { BsCheck2, BsExclamationTriangleFill, BsX } from 'react-icons/bs';
import { Editor } from '@monaco-editor/react';
import { Button, Tooltip } from '@nextui-org/react';

interface MonacoResponseGroupContentEditorProps {
    itemComponent?: ItemComponent;
    onChange: (itemComponent: ItemComponent) => void;
}

const MonacoResponseGroupContentEditor: React.FC<MonacoResponseGroupContentEditorProps> = (props) => {
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [editorContent, setEditorContent] = React.useState<string | undefined>(undefined);
    const [contentAsItemComponent, setContentAsItemComponent] = React.useState<ItemComponent | undefined>(undefined);

    const itemComponentAsYaml = React.useMemo(() => {
        setContentAsItemComponent(props.itemComponent);
        return yaml.dump(props.itemComponent);
    }, [props.itemComponent]);


    React.useEffect(() => {
        setEditorContent(itemComponentAsYaml);
    }, [itemComponentAsYaml]);

    return (
        <div>
            <div className='flex items-center gap-unit-sm bg-content3 px-unit-sm py-2 rounded-small mb-unit-sm'>
                <span>
                    <BsExclamationTriangleFill className='text-default-500' />
                </span>
                <span className='text-small'>
                    This is a temporary editor UI for the response component where you can use YAML format to edit the raw data stored in the model.
                </span>
            </div>

            <div className='overflow-hidden border p rounded-medium relative'>
                <p className="text-tiny px-3 py-2">Response component (in YAML format)</p>
                <Editor
                    height="250px" defaultLanguage="yaml"
                    value={editorContent}
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        rounedSelection: true,
                        suggestionDelay: 100,
                    }}
                    language='yaml'
                    onChange={(e) => {
                        setEditorContent(e);
                        if (!e) return;
                        try {
                            yaml.loadAll(e, (doc) => {
                                if (doc) {
                                    const itemComp = doc as ItemComponent;
                                    /*if (!checkExpression(expression)) {
                                        setContentAsExpression(undefined);
                                        setErrorMsg('please check the syntax of the expression');
                                        return;
                                    }*/
                                    setContentAsItemComponent(doc as ItemComponent);
                                    setErrorMsg(undefined);
                                }
                            })
                        } catch (e) {
                            console.log(e);
                            setContentAsItemComponent(undefined);
                            setErrorMsg('please check the syntax of the expression');
                        }
                    }}
                />
                {errorMsg && <p className='absolute bottom-0 bg-red-50/80 w-full text-center text-danger-500 text-sm py-1 px-unit-md font-bold'>{errorMsg}</p>}
            </div>
            {editorContent !== itemComponentAsYaml &&
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
                                    setEditorContent(itemComponentAsYaml);
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
                            isDisabled={!contentAsItemComponent}
                            onPress={() => {
                                if (contentAsItemComponent) {
                                    props.onChange(contentAsItemComponent);
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

export default MonacoResponseGroupContentEditor;
