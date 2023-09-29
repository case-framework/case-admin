import CaseAdminHeader from "@/components/CaseAdminHeader";
import Container from "@/components/Container";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import { Card, CardBody } from "@nextui-org/card";
import Image from 'next/image';
import { Link as NextUILink } from '@nextui-org/link'
import NavbarAuth from "../../components/navbar/NavbarAuth";
import StudyConfigIcon from "@/components/tool-icons/StudyConfigIcon";
import ParticipantsIcon from "@/components/tool-icons/ParticipantsIcon";
import UserManagementIcon from "@/components/tool-icons/UserManagementIcon";
import MessagingIcon from "@/components/tool-icons/MessagingIcon";
import ServiceStatusIcon from "@/components/tool-icons/ServiceStatusIcon";
import EditorsIcon from "@/components/tool-icons/EditorsIcons";



interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
}


const ToolCard: React.FC<ToolCardProps> = (props) => {
    return (
        <Card
            as={NextUILink}
            href={props.href}
            isPressable
            radius="sm"
            shadow="sm"
            isHoverable
        >
            <CardBody>
                <div className="flex gap-unit-4">
                    <div>
                        {props.icon}
                    </div>
                    <div>
                        <h3 className="text-md font-semibold">{props.title}</h3>
                        <p className="text-small text-default-500">{props.description}</p>
                    </div>
                </div>

            </CardBody>
        </Card>
    )
}


export default async function Page() {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <main className="h-screen flex flex-col">
            <Navbar isBordered
                maxWidth="full"
                shouldHideOnScroll
            >
                <Container className="flex grow">
                    <NavbarBrand
                        className="flex flex-col items-start justify-center border-l-2 border-cyan-800 ps-unit-2"
                    >
                        <p className='font-normal text-cyan-800 text-tiny'>CASE ADMIN</p>
                        <p className='font-semibold tracking-wider text-small'>{appName}</p>

                    </NavbarBrand>

                    <NavbarContent justify="end">
                        <NavbarAuth />
                    </NavbarContent>
                </Container>
            </Navbar>

            <div className="relative w-full h-80 py-unit-lg ">
                <Image
                    src="/images/crowd.png"
                    fill
                    priority
                    className="object-cover"
                    alt=""
                />
                <Container className="h-full flex items-center justify-start">
                    <Card
                        isBlurred
                        className=" bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                        shadow="sm"
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

            <section>
                <Container className="py-unit-xl">
                    <div className=" mb-unit-lg">
                        <h2 className="text-2xl font-bold mb-unit-1">Available Tools</h2>
                        <p className="text-small text-default-500">
                            Select one of the tools below to start managing your study system
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-lg">
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
                            title='Service status'
                            description='Overview showing if the application can connect to the backend services.'
                            href='/service-status'
                            icon={<ServiceStatusIcon size="lg" />}
                        />
                    </div>
                </Container>
            </section>

            <div className="grow"></div>

            <footer className="bg-content3">
                <Container className="py-unit-xl flex justify-center text-sm text-default-600">
                    <span className="me-1">© {(new Date()).getFullYear()},</span>
                    <span>CASE Admin Tool</span>
                    <span className="mx-1">by</span>
                    <NextUILink
                        href="https://coneno.com"
                        isExternal={true}
                        showAnchorIcon
                        size="sm"
                        color="foreground"
                        className="text-default-600 hover:text-default-700"
                    >
                        coneno
                    </NextUILink>
                </Container>
            </footer>
        </main>
    )
}
