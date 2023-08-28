import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Spinner } from "@nextui-org/spinner";
import { Suspense } from "react";

import StudySelector from "./StudySelector";
import { pageTitle } from "@/utils/pageTitle";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: pageTitle('Study Selector'),
    description: 'Select a study to view participants.',
}


export default async function Page() {
    return (

        <main
            className="px-unit-lg"
        >
            <div className="flex justify-center items-center p-unit-lg h-full">
                <Card
                    fullWidth={false}
                    className="bg-white/50 w-full sm:w-[600px]"
                    isBlurred
                    isFooterBlurred
                >
                    <CardHeader className="bg-content2">
                        <h2 className="text-2xl font-bold">Select study</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody className="">
                        <Suspense fallback={<div className="flex py-unit-md flex-col justify-center items-center text-center">
                            <Spinner />
                        </div>}>
                            <div className="flex flex-col gap-unit-md">
                                <StudySelector />
                            </div>
                        </Suspense>
                    </CardBody>

                </Card>
            </div>
        </main>

    )
}
