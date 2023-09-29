import { Button } from '@nextui-org/button';
import { Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { BsPencil } from 'react-icons/bs';
import { Expression } from 'survey-engine/data_types';
import * as yaml from 'js-yaml';
import { Editor } from '@monaco-editor/react';

interface MonacoSurveyPrefillRuleEditorProps {
    prefillRules: Expression[];
    onPrefillRulesChange: (rules: Expression[]) => void;
}

interface EditorDialogProps {
    isOpen: boolean;
    onCancel: () => void;
    onApply: (rules: Expression[]) => void;
    rules: Expression[];
}

const EditorDialog: React.FC<EditorDialogProps> = (props) => {
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const [editorContent, setEditorContent] = React.useState<string | undefined>(undefined);
    const [contentAsExpression, setContentAsExpression] = React.useState<Expression[] | undefined>(undefined);

    const expressionAsYaml = React.useMemo(() => {
        setContentAsExpression(props.rules);
        return yaml.dump(props.rules);
    }, [props.rules]);


    React.useEffect(() => {
        setEditorContent(expressionAsYaml);
    }, [expressionAsYaml]);


    const hasChanges = editorContent !== expressionAsYaml;

    return <Modal isOpen={props.isOpen}
        isDismissable={false}
        size='5xl'
        onOpenChange={() => {
            if (hasChanges) {
                if (!confirm('Are you sure you want to cancel? All changes will be lost.')) {
                    return;
                }
            }
            props.onCancel()
        }}
        backdrop='blur'
    >
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="">
                        Edit prefill rules
                    </ModalHeader>
                    <Divider />
                    <ModalBody className='p-0'>
                        <Editor
                            height="500px" defaultLanguage="yaml"
                            value={editorContent}
                            options={{
                                minimap: {
                                    enabled: false,
                                },
                                roundedSelection: true
                            }}
                            language='yaml'
                            onChange={(e) => {
                                setEditorContent(e);
                                if (!e) return;
                                try {
                                    yaml.loadAll(e, (doc) => {
                                        if (doc) {
                                            const expression = doc as Expression[];
                                            setContentAsExpression(doc as Expression[]);
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
                    </ModalBody>
                    <Divider />
                    <ModalFooter>
                        <div className='flex gap-unit-sm'>
                            <Button
                                onPress={() => {
                                    onClose();
                                }}
                                color='danger'
                                variant='light'
                            >
                                Cancel
                            </Button>
                            <Button
                                onPress={() => props.onApply(contentAsExpression ? contentAsExpression : [])}
                                color='primary'
                                variant='flat'
                                isDisabled={!hasChanges}
                            >
                                Apply
                            </Button>
                        </div>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    </Modal>
}


const MonacoSurveyPrefillRuleEditor: React.FC<MonacoSurveyPrefillRuleEditorProps> = (props) => {
    const [editorDialogOpen, setEditorDialogOpen] = React.useState<boolean>(false);

    return (
        <div className='space-y-unit-md'>
            <div className='space-y-unit-sm'>
                <h3 className='text-lg font-bold'>
                    Prefill rules
                </h3>
                <div>
                    Number of prefill rules: <span className='text-secondary font-bold'>{props.prefillRules.length}</span>
                </div>
                <Button
                    color='default'
                    startContent={<BsPencil />}
                    type='button'
                    onPress={() => setEditorDialogOpen(true)}
                >
                    Edit
                </Button>
                <EditorDialog
                    isOpen={editorDialogOpen}
                    onCancel={() => setEditorDialogOpen(false)}
                    onApply={(rules) => {
                        props.onPrefillRulesChange(rules);
                        setEditorDialogOpen(false);
                    }}
                    rules={props.prefillRules}
                />
            </div>
        </div>
    );
};

export default MonacoSurveyPrefillRuleEditor;
