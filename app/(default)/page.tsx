import CaseAdminHeader from "@/components/CaseAdminHeader";
import Container from "@/components/Container";
import Image from 'next/image';
import NavbarAuth from "../../components/navbar/NavbarAuth";
import StudyConfigIcon from "@/components/tool-icons/StudyConfigIcon";
import ParticipantsIcon from "@/components/tool-icons/ParticipantsIcon";
import UserManagementIcon from "@/components/tool-icons/UserManagementIcon";
import MessagingIcon from "@/components/tool-icons/MessagingIcon";
import EditorsIcon from "@/components/tool-icons/EditorsIcons";
import DocumentationIcon from "@/components/tool-icons/DocumentationIcon";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export const revalidate = 3600;

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}


const ToolCard: React.FC<ToolCardProps> = (props) => {
    return (
        <Link
            href={props.href}
            prefetch={false}
        >
            <Card className="p-3 hover:bg-slate-50 cursor-pointer transition-colors duration-200 ease-in-out">
                <div className="flex gap-4">
                    <div>
                        {props.icon}
                    </div>
                    <div>
                        <h3 className="text-md font-semibold">{props.title}</h3>
                        <p className="text-sm text-neutral-600">{props.description}</p>
                    </div>
                </div>
            </Card>
        </Link>
    )
}


export default async function Page() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';
    const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;

    return (
        <main className="h-screen flex flex-col">
            <nav
                className="border-b border-neutral-400 flex items-center w-full py-3"
            >
                <Container className="flex grow">
                    <div
                        className="grow flex flex-col items-start justify-center border-l-2 border-cyan-800 ps-2"
                    >
                        <p className='font-normal text-cyan-800 text-xs'>CASE ADMIN</p>
                        <p className='font-semibold tracking-wider text-sm'>{appName}</p>

                    </div>

                    <div>
                        <NavbarAuth />
                    </div>
                </Container>
            </nav>

            <div className="relative w-full h-80 py-8 ">
                <Image
                    src="/images/crowd.png"
                    fill
                    priority
                    className="object-cover"
                    alt=""
                />
                <div className="absolute bottom-10 left-0 w-full">
                    <Container className="h-full flex items-center justify-start ">
                        <Card
                            variant={'opaque'}
                            className="border-none  max-w-[610px]"
                        >
                            <div className=" p-8 h-full my-auto flex flex-col justify-center">
                                <div>
                                    <CaseAdminHeader
                                        appName={appName}
                                    />
                                    <p className='mt-4'>This is the admin tool, to manage studies, surveys, messages and participants.</p>
                                </div>
                            </div>
                        </Card>
                    </Container>
                </div>
            </div>

            <section>
                <Container className="py-8">
                    <div className=" mb-6">
                        <h2 className="text-2xl font-bold mb-1">Available Tools</h2>
                        <p className="text-sm text-neutral-600">
                            Select one of the tools below to start managing your study system
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ToolCard
                            title='Study configurator'
                            description='Create, edit or delete studies. Manage study rules and surveys.'
                            href='/tools/study-configurator'
                            icon={<StudyConfigIcon size="lg" />}
                        />
                        <ToolCard
                            title='Participants'
                            description='Features to access study participants and their data.'
                            href='/tools/participants'
                            icon={<ParticipantsIcon size="lg" />}
                        />
                        <ToolCard
                            title='User management'
                            description='User management related functions for admins.'
                            href='/tools/user-management'
                            icon={<UserManagementIcon size="lg" />}
                        />
                        <ToolCard
                            title='Messaging'
                            description='Configure email templates and message schedules for the system.'
                            href='/tools/messaging'
                            icon={<MessagingIcon size="lg" />}
                        />
                        <ToolCard
                            title='Standalone editors'
                            description='Access standalone editors for surveys, rules and messages. (Load from and save on your local drive)'
                            href='/tools/editors'
                            icon={<EditorsIcon size="lg" />}
                        />
                        <ToolCard
                            title='Documentation'
                            description='Learn how to use the tools'
                            href='/docs'
                            icon={<DocumentationIcon size="lg" />}
                        />
                    </div>
                </Container>
            </section>

            <div className="grow"></div>

            <footer className="bg-gray-100">
                <Container className="py-6 gap-2 flex flex-col items-center justify-center text-sm text-neutral-600">
                    <div>
                        <span className="me-1">© {(new Date()).getFullYear()},</span>
                        <span>CASE Admin Tool</span>
                        <span className="mx-1">by</span>
                        <Button variant={'link'}
                            asChild
                            className="text-neutral-600 hover:text-cyan-800 p-0 h-auto"
                        >
                            <Link
                                href="https://coneno.com"
                                prefetch={false}
                                target="_blank"
                            >
                                coneno
                            </Link>
                        </Button>
                    </div>
                    {appVersion && (
                        <div className="text-xs">
                            {appVersion}
                        </div>
                    )}

                </Container>
            </footer>
        </main>
    )
}
