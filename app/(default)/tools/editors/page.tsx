import React from 'react';
import EditorsAppbarBase from './EditorsAppbar';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import LinkCard from '@/components/LinkCard';
import { Divider } from '@nextui-org/divider';
import { BsCheckAll, BsFiletypeHtml, BsShuffle, BsUiChecks } from 'react-icons/bs';

interface PageProps {
}

const Page: React.FC<PageProps> = (props) => {
    return (
        <div>
            <EditorsAppbarBase />
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
                                Available editors
                            </h2>
                        </CardHeader>
                        <Divider />
                        <CardBody className="">
                            <div className="flex flex-col gap-unit-md">
                                <LinkCard
                                    href="/tools/editors/survey"
                                    title="Survey editor"
                                    description="Create or load a survey form a local file, edit properties and items, preview and save to your computer."
                                    icon={<BsUiChecks />}
                                />
                                <LinkCard
                                    href="/tools/editors/expressions"
                                    title="Expression editor"
                                    description="Create or load expressions (e.g., study rules) from a local file, edit and save to your computer."
                                    icon={<BsShuffle />}
                                />
                                <LinkCard
                                    href="/tools/editors/email-template"
                                    title="Email template editor"
                                    description="Create or load email templates from a local file, edit and save to your computer."
                                    icon={<BsFiletypeHtml />}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Page;
