import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import LinkCard from "@/components/LinkCard";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsCardText, BsFileEarmarkLock, BsFileEarmarkSpreadsheet, BsFolder2Open, BsPeople, BsX } from "react-icons/bs";
import { Button } from "@nextui-org/button";
import { pageTitle } from "@/utils/pageTitle";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: pageTitle('Participants Menu'),
}


interface PageProps {
    params: {
        studyKey: string;
    }
}

export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect(`/auth/login?callbackUrl=/tools/participants/${props.params.studyKey}`);
    }

    return (
        <main className="px-unit-lg">

            <div className="flex justify-center items-center py-unit-lg h-full">
                <Card
                    fullWidth={false}
                    className="bg-white/50 w-full sm:w-[600px]"
                    isBlurred
                    isFooterBlurred
                >
                    <CardHeader className="bg-content2">
                        <h2 className="text-2xl font-bold flex items-center w-full">
                            Participant tools <span className="ms-2  text-default-400 grow">({props.params.studyKey})</span>
                            <Button
                                as={Link}
                                href="/tools/participants"
                                variant="light"
                                isIconOnly
                            >
                                <BsX className="text-2xl" />
                            </Button>
                        </h2>
                    </CardHeader>
                    <Divider />
                    <CardBody className="">
                        <div className="flex flex-col gap-unit-md">
                            <LinkCard
                                href={`/tools/participants/${props.params.studyKey}/overview`}
                                title="Participants"
                                description="Access participant states to get an overview what happens in your study."
                                icon={<BsPeople />}
                            />
                            <LinkCard
                                href={`/tools/participants/${props.params.studyKey}/responses`}
                                title="Responses"
                                description="Download responses and survey info files for the study."
                                icon={<BsFileEarmarkSpreadsheet />}
                            />
                            <LinkCard
                                href={`/tools/participants/${props.params.studyKey}/confidential-responses`}
                                title="Confidential responses"
                                description="Download for confidential responses."
                                icon={<BsFileEarmarkLock />}
                            />
                            <LinkCard
                                href={`/tools/participants/${props.params.studyKey}/reports`}
                                title="Participant reports"
                                description="Browse report objects created for participants."
                                icon={<BsCardText />}
                            />
                            <LinkCard
                                href={`/tools/participants/${props.params.studyKey}/files`}
                                title="Participant files"
                                description="Browse and download files provided by the participants."
                                icon={<BsFolder2Open />}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </main>
    )
}
