import React from 'react';
import ToolIconBase from './ToolIconBase';
import { BookIcon } from 'lucide-react';

interface MessagingIconProps {
    size: 'md' | 'lg';
}

const MessagingIcon: React.FC<MessagingIconProps> = (props) => {
    return (
        <ToolIconBase
            size={props.size}
            icon={<BookIcon />}
            color='bg-linear-to-b from-blue-400 to-blue-600 text-white'
        />
    );
};

export default MessagingIcon;
