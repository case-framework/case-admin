import { Study } from "@/utils/server/types/studyInfos"
import { Card, CardBody } from "@nextui-org/card"
import { Chip } from "@nextui-org/chip";
import { BsChevronRight, BsDot } from "react-icons/bs";
import { Link as NextUILink } from "@nextui-org/link";


const StudyCard = (props: { study: Study, baseURL: string }) => {
    return <Card
        className=" bg-white"
        radius='sm'
        isPressable
        as={NextUILink}
        href={`${props.baseURL}/${props.study.key}`}
    >
        <CardBody className='p-unit-sm'>
            <div className=' flex'>
                <div className='grow'>
                    <div className='text-lg font-bold'>
                        {props.study.key}
                        {props.study.props.systemDefaultStudy && <Chip color='default' variant='flat' size='sm' className='ml-unit-sm'>Default</Chip>}
                    </div>
                    <div className='text-small flex items-center mt-unit-1'>
                        <span className='me-1 text-default-500'>Participants: </span>
                        <span>{(props.study.stats.participantCount || 0) + (props.study.stats.tempParticipantCount || 0)}</span>
                        <span><BsDot /></span>
                        <span className='me-1 text-default-500'>Responses: </span>
                        <span>{props.study.stats.responseCount || 0}</span>
                    </div>

                </div>
                <div className='flex items-center gap-unit-sm'>
                    <Chip
                        variant='dot'
                        color={
                            props.study.status === 'active' ? 'success' : 'default'
                        }>
                        {props.study.status}
                    </Chip>
                    <BsChevronRight />
                </div>
            </div>

        </CardBody>
    </Card>
}

export default StudyCard;
