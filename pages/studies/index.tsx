import Link from 'next/link';
import useSWR, { Fetcher } from 'swr';

interface Study {
    key: string;
    name: string;
}

interface Studies {
    studies: Study[];
}

const StudyListFetcher: Fetcher<Studies, string> = () => fetch(`/api/studies`).then((res) => res.json());


export default function Studies() {
    const { data: studies, error, isLoading } = useSWR<Studies, Error>('studies', StudyListFetcher);

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
                        Error: {error.message}</div>}
                    {studies?.studies.map((study) => {
                        return (
                            <Link
                                key={study.key}
                                className='block mb-2 hover:underline text-blue-600 '
                                href={`/studies/${study.key}/dashboard`}>
                                {study.key}
                            </Link>
                        )
                    })
                    }
                </div>
            </main>
        </>
    )
}
