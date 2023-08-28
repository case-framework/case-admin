import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import LinkCard from "@/components/LinkCard";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { BsCalendarWeek, BsCodeSquare, BsEnvelopePaper } from "react-icons/bs";



export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/auth/login?callbackUrl=/tools/messaging');
    }

    return (
        <main className="px-unit-lg">

            <div className="flex justify-center items-center p-unit-lg h-full">
                <Card
                    fullWidth={false}
                    className="bg-white/50 w-full sm:w-[600px]"
                    isBlurred
                    isFooterBlurred
                >
                    <CardHeader className="bg-content2">
                        <h2 className="text-2xl font-bold">
                            Messaging tools
                        </h2>
                    </CardHeader>
                    <Divider />
                    <CardBody className="">
                        <div className="flex flex-col gap-unit-md">
                            <LinkCard
                                href="/tools/messaging/system-messages/registration"
                                title="System messages"
                                description="Configure messages sent by the system at specific events, like signup, password reset, etc."
                                icon={<BsEnvelopePaper />}
                            />
                            <LinkCard
                                href="/tools/messaging/custom-messages"
                                title="Custom messages"
                                description="Messages for specific study events (e.g. reminders) or for researcher notifications can be configured here."
                                icon={<BsCodeSquare />}
                            />
                            <LinkCard
                                href="/tools/messaging/schedules"
                                title="Message schedules"
                                description="Manage schedules for sending messages, e.g., weekly emails."
                                icon={<BsCalendarWeek />}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </main>
    )
}
