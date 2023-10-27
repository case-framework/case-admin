import { Study } from '@/utils/server/types/studyInfos';
import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import React from 'react';
import DisplayTexts from './DisplayTexts';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';


interface StudyOverviewProps {
    study: Study;
}


const StudyOverview: React.FC<StudyOverviewProps> = (props) => {
    const studyStats = <div className='flex flex-col gap-2 md:flex-row'>
        <div className='flex flex-col grow text-end'>
            <span className='text-default-400 text-small'>
                Participant count
            </span>
            <span className='text-2xl font-bold'>
                {props.study.stats.participantCount || 0}
            </span>
        </div>

        <div className='flex flex-col grow text-end'>
            <span className='text-default-400 text-small'>
                Temporary participants
            </span>
            <span className='text-2xl font-bold'>
                {props.study.stats.tempParticipantCount || 0}
            </span>
        </div>

        <div className='flex flex-col grow'>
            <span className='text-default-400 text-small text-end'>
                Response count
            </span>
            <span className='text-2xl font-bold text-end'>
                {props.study.stats.responseCount || 0}
            </span>
        </div>
    </div>

    return (
        <>
            <TwoColumnsWithCards
                label='General infos'
                description='Study key, status, id mapping method, etc. You can change study status and if the study is a system default study.'
            >
                <div className='flex flex-col gap-unit-md mb-unit-md'>
                    <div className='flex flex-col grow'>
                        <span className='text-default-400 text-small'>
                            Study Key
                        </span>
                        <span className='text-2xl text-primary font-bold'>
                            {props.study.key} {props.study.props.systemDefaultStudy && <span className='text-default-500 text-sm'>Default</span>}
                        </span>
                    </div>
                    <div className='flex flex-col text-start'>
                        <span className='text-default-400 text-small mb-1'>
                            ID mapping method
                        </span>
                        <span className='text-large font-bold'>
                            {props.study.configs.idMappingMethod || 'default'}
                        </span>
                    </div>
                    <div className='flex flex-col text-start'>
                        <span className='text-default-400 text-small mb-unit-1'>
                            Status
                        </span>
                        <Chip
                            variant='dot'
                            color={
                                props.study.status === 'active' ? 'success' : 'default'
                            }
                        >
                            {props.study.status}
                        </Chip>
                    </div>
                </div>
                <Divider />
                {studyStats}
            </TwoColumnsWithCards>
            <Divider />
            <TwoColumnsWithCards
                label='Study card'
                description='Preview or edit the study card. The study card is shown to participants in the app if the feature is supported by your instance.'
            >
                <DisplayTexts
                    studyKey={props.study.key}
                    studyProps={props.study.props}
                />
            </TwoColumnsWithCards>
        </>
    );
};

export default StudyOverview;
