'use client'

import React from 'react';
import { Divider } from "@nextui-org/divider";
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import ParticipantDetails from './ParticipantDetails';
import ParticipantList from './ParticipantList';
import { ParticipantState } from '@/utils/server/types/participantState';

interface ParticipantOverviewScreenProps {

    studyKey: string;

}

const ParticipantOverviewScreen: React.FC<ParticipantOverviewScreenProps> = (props) => {
    const [selectedParticipant, setSelectedParticipant] = React.useState<ParticipantState | undefined>(undefined);


    return (
        <div className="flex gap-1 h-full">
            <div className='w-80 h-full overflow-y-scroll pt-unit-md'>
                <h2 className='text-2xl font-bold mb-unit-md'>Participants</h2>

                <ParticipantList
                    studyKey={props.studyKey}
                    onParticipantSelected={(participant) => setSelectedParticipant(participant)}
                />
            </div>
            <Divider orientation="vertical" />
            <div className='grow h-full overflow-y-scroll pt-unit-md'>
                <ParticipantDetails
                    participant={selectedParticipant}
                />
            </div>
        </div>
    );
};

export default ParticipantOverviewScreen;
