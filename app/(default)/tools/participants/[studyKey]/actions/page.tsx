import React from 'react';
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';

const Page: React.FC<PageProps> = async (props) => {
    redirect(`/tools/participants/${(await props.params).studyKey}/actions/general`);
    return null;
};

export default Page;
