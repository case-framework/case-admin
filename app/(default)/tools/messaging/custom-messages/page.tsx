import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { BsCodeSquare, BsPlus } from "react-icons/bs";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import CustomEmailTemplates from "./CustomEmailTemplates";

export const dynamic = 'force-dynamic';

interface PageProps {

}

export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/auth/login?callbackUrl=/tools/messaging/custom-messages');
    }

    return (
        <div className="px-unit-lg h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/messaging"
                    links={
                        [
                            {
                                title: 'Custom messages',
                            },
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <div className="flex justify-center items-center p-unit-lg h-full">
                        <Card
                            fullWidth={false}
                            className="bg-white/50 w-full sm:w-[600px]"
                            isBlurred
                            isFooterBlurred
                        >
                            <CardHeader className="bg-content2">
                                <h2 className="text-2xl font-bold flex items-center">
                                    <BsCodeSquare className="inline-block mr-unit-sm text-default-400" />
                                    Custom messages
                                </h2>
                            </CardHeader>
                            <Divider />
                            <CardBody className="">
                                <CustomEmailTemplates />
                            </CardBody>
                            <Divider />
                            <CardFooter

                            >
                                <Button
                                    variant="flat"
                                    color="primary"
                                    as={Link}
                                    href="/tools/messaging/custom-messages/editor"
                                >
                                    <BsPlus />
                                    Create new message template
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
