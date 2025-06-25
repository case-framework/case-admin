import React from 'react';
import { BsJournalMedical } from 'react-icons/bs';
import ToolIconBase from './ToolIconBase';

interface StudyConfigIconProps {
    size: 'md' | 'lg';
}

const StudyConfigIcon: React.FC<StudyConfigIconProps> = (props) => {
    return (
        <ToolIconBase
            size={props.size}
            icon={<BsJournalMedical />}
            color='bg-linear-to-b from-sky-400 to-sky-600 text-white'
        />
    );
};

export default StudyConfigIcon;
