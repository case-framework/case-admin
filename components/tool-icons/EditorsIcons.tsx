import React from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import ToolIconBase from './ToolIconBase';

interface EditorsIconProps {
    size: 'md' | 'lg';
}

const EditorsIcon: React.FC<EditorsIconProps> = (props) => {
    return (
        <ToolIconBase
            size={props.size}
            icon={<BsPencilSquare />}
            color='bg-gradient-to-br from-fuchsia-500 to-purple-500 text-white'
        />
    );
};

export default EditorsIcon;
