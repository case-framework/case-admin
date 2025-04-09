import React from 'react';
import EditorsAppbarBase from './EditorsAppbar';
import LinkCard from '@/components/LinkCard';

import { BsFiletypeHtml, BsShuffle, BsUiChecks } from 'react-icons/bs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


const Page: React.FC = () => {
    return (
        <div>
            <EditorsAppbarBase />
            <main className="px-6">

                <div className="flex justify-center items-center p-6 h-full">
                    <Card
                        variant={'opaque'}
                    >
                        <CardHeader>
                            <h2 className="text-2xl font-bold">
                                Available editors
                            </h2>
                        </CardHeader>

                        <CardContent className="">
                            <div className="flex flex-col gap-4">
                                <LinkCard
                                    href="/tools/editors/survey"
                                    title="Survey editor"
                                    description="Create or load a survey form a local file, edit properties and items, preview and save to your computer."
                                    icon={<BsUiChecks />}
                                />
                                <LinkCard
                                    href="/tools/editors/study-expressions"
                                    title="Study expression editor"
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
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Page;
