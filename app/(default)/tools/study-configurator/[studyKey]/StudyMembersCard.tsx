import { Study } from '@/utils/server/types/studyInfos';
import React from 'react';
import NotImplemented from '@/components/NotImplemented';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';

interface StudyMembersCardProps {
    study: Study;
}

const StudyMembersCard: React.FC<StudyMembersCardProps> = (props) => {
    return (
        <TwoColumnsWithCards
            label='Members'
            description='Which RESEARCHERS are allowed to access this study?'
        >
            <NotImplemented>
                show study members with their roles here
            </NotImplemented>
        </TwoColumnsWithCards>
    );
};

export default StudyMembersCard;
