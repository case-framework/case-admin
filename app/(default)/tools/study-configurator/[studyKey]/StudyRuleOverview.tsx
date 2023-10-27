import { Button } from '@nextui-org/button';
import React from 'react';
import NotImplemented from '@/components/NotImplemented';
import { Link as NextUILink } from '@nextui-org/link'
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';
import { BsBracesAsterisk, BsShuffle } from 'react-icons/bs';


interface StudyRuleOverviewProps {
    studyKey: string;
}

const StudyRuleOverview: React.FC<StudyRuleOverviewProps> = (props) => {
    return (
        <TwoColumnsWithCards
            label='Rules & actions'
            description='Study rules govern what happens at specific study events. Study actions are one-time rules that can be executed manually.'
        >
            <h3 className='mb-1 font-bold'>Links:</h3>
            <div className='grid grid-cols-2 gap-unit-md'>
                <Button
                    as={NextUILink}
                    href={`/tools/study-configurator/${props.studyKey}/rules`}
                    size='lg'
                    startContent={<span><BsShuffle /></span>}
                >
                    Go to study rules
                </Button>
                <Button
                    as={NextUILink}
                    href={`/tools/study-configurator/${props.studyKey}/actions`}
                    size='lg'
                    startContent={<span><BsBracesAsterisk /></span>}
                >

                    Go to study actions
                </Button>
            </div>
        </TwoColumnsWithCards>
    );
};

export default StudyRuleOverview;
