'use client';

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useTransition } from 'react';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { deleteStudyAction } from './actionDeleteStudy';
import { useRouter } from 'next/navigation';
import TwoColumnsWithCards from '@/components/TwoColumnsWithCards';


interface DangerZoneProps {
    studyKey: string;
}

const StudyDeletionDialog = ({ studyKey }: { studyKey: string }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [confirmStudyKey, setConfirmStudyKey] = React.useState<string>('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [error, setError] = React.useState<string>('');

    const deleteStudy = async () => {
        startTransition(async () => {
            setError('');
            try {
                await deleteStudyAction(studyKey);
                router.refresh();
                router.replace('/tools/study-configurator');
            } catch (error: any) {
                setError(`failed to delete study: ${error.message}`);
                console.error(error);
            }
        })
    }


    return (
        <>
            <Button
                color='danger'
                variant='ghost'
                onPress={onOpen}
            >
                Delete study
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop='blur'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader

                                className="flex flex-col gap-1">
                                <h3 className='text-xl font-bold'>Delete study</h3>
                            </ModalHeader>
                            <ModalBody className='py-unit-sm'>
                                <Input
                                    label={`Enter study key ("${studyKey}") to confirm deletion`}
                                    placeholder='Study key'
                                    labelPlacement='outside'
                                    value={confirmStudyKey}
                                    onValueChange={setConfirmStudyKey}
                                />
                                {error && (
                                    <p className='text-danger text-small'>{error}</p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}
                                    isDisabled={isPending}
                                >
                                    Close
                                </Button>
                                <Button color="danger" variant='flat' onPress={deleteStudy}
                                    isDisabled={confirmStudyKey !== studyKey}
                                    isLoading={isPending}

                                >
                                    Delete Study
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}


const DangerZone: React.FC<DangerZoneProps> = (props) => {
    return (
        <TwoColumnsWithCards
            label='Danger zone'
            description='If the study is not needed anymore, you can delete it.'
        >
            <div className='flex flex-col h-full gap-unit-md'>
                <div className='flex flex-col gap-unit-sm'>
                    <h4 className='text-large font-bold'>Delete study</h4>

                    <p className='text-warning-700 flex gap-unit-sm items-center bg-warning-50 p-unit-sm rounded-medium'>
                        <BsExclamationTriangleFill className='text-warning text-2xl' />
                        {`This is an irreversible action. You won't be able to access the study anymore.`}
                    </p>
                    <div>
                        <StudyDeletionDialog
                            studyKey={props.studyKey}
                        />
                    </div>
                </div>

            </div>
        </TwoColumnsWithCards>
    );
};

export default DangerZone;
