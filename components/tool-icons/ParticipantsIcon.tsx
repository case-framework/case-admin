import React from 'react';
import { BsClipboard2Data } from 'react-icons/bs';
import ToolIconBase from './ToolIconBase';

interface ParticipantsIconProps {
    size: 'md' | 'lg';
}

const ParticipantsIcon: React.FC<ParticipantsIconProps> = (props) => {
    return (
        <ToolIconBase
            size={props.size}
            icon={<BsClipboard2Data />}
            color='bg-linear-to-b from-orange-400 to-orange-600 text-white'
        />
    );
};

export default ParticipantsIcon;
