import React from 'react';
import { BsEnvelopeAt } from 'react-icons/bs';
import ToolIconBase from './ToolIconBase';

interface MessagingIconProps {
    size: 'md' | 'lg';
}

const MessagingIcon: React.FC<MessagingIconProps> = (props) => {
    return (
        <ToolIconBase
            size={props.size}
            icon={<BsEnvelopeAt />}
            color='bg-linear-to-b from-indigo-400 to-indigo-600 text-white'
        />
    );
};

export default MessagingIcon;
