import React, { useEffect } from 'react';
import MonacoExpressionEditor from './MonacoExpressionEditor';
import { Expression } from 'survey-engine/data_types';
import { Button } from '@nextui-org/button';
import { BsCode, BsPlusCircleDotted, BsXCircle } from 'react-icons/bs';

interface ItemConditionEditorProps {
    condition?: Expression;
    onChange: (condition?: Expression) => void;
}

const ItemConditionEditor: React.FC<ItemConditionEditorProps> = (props) => {
    const [addNewCondition, setAddNewCondition] = React.useState<boolean>(false);


    if (!props.condition && !addNewCondition) {
        return <div className='text-center'>
            <div className='flex items-center gap-unit-sm mb-1 justify-center h-24 border rounded-medium bg-default-50'>
                <span className='text-xl text-default-400'>
                    <BsCode />
                </span>
                <span className='text-small text-default-600'>
                    No condition provided
                </span>
            </div>

            <Button
                startContent={<BsPlusCircleDotted />}
                variant='light'
                color='primary'
                onPress={() => setAddNewCondition(true)}
            >
                Add new condition
            </Button>
        </div>
    }

    return (
        <div>
            {props.condition &&
                <div className='flex justify-end mb-unit-sm'>
                    <Button
                        startContent={<BsXCircle />}
                        variant='light'
                        color='danger'
                        onPress={() => {
                            if (confirm('Are you sure you want to remove the condition?')) {
                                setAddNewCondition(false)
                                props.onChange(undefined);
                            }
                        }}
                    >
                        Remove condition
                    </Button>
                </div>}
            <MonacoExpressionEditor
                expression={props.condition}
                onChange={(expression) => {
                    props.onChange(expression);
                }}
            />
        </div>
    );
};

export default ItemConditionEditor;
