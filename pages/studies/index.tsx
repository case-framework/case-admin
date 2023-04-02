import { ApiError, AuthAPIFetcher } from '@/utils/server/fetcher';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import useSWR from 'swr';

interface Study {
    key: string;
    name: string;
}

interface Studies {
    studies: Study[];
}


export default function Studies() {
    const { data: studyResponse, error, isLoading } = useSWR<Studies, ApiError>('/api/studies', AuthAPIFetcher);
    console.log(studyResponse, error, isLoading)

    if (error?.status === 401) {
        signIn();
    }

    return (
        <>
            <main className='p-4'>
                <div>
                    <Link
                        className='block mb-2 hover:underline text-blue-600 '
                        href='/'>
                        Back to home
                    </Link>
                </div>

                <div>
                    <h2 className='mt-4 mb-2 text-slate-500'>Studies:</h2>
                    {isLoading && <div>Loading...</div>}
                    {error && <div className='text-red-500'>
                        Error: {error.message} - Reason: {error.info.error}</div>}

                    {studyResponse?.studies ? studyResponse.studies.map((study) => {
                        return (
                            <Link
                                key={study.key}
                                className='block mb-2 hover:underline text-blue-600 '
                                href={`/studies/${study.key}/dashboard`}>
                                {study.key}
                            </Link>
                        )
                    }) : null
                    }
                </div>
            </main>
        </>
    )
}
