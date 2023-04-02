import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import { ApiError, AuthAPIFetcher } from '@/utils/server/fetcher';
import { SurveyInfos } from '@/utils/server/types/studyInfos';


export default function Dashboard() {
    const router = useRouter()
    const { study: studyKey } = router.query

    const { data: surveyList, error, isLoading } = useSWR<SurveyInfos, ApiError>(`/api/studies/${studyKey}/survey`, AuthAPIFetcher);

    console.log(studyKey, surveyList, error, isLoading);

    return (
        <div
            className='p-4'
        >
            <div>
                <Link
                    className='block mb-2 hover:underline text-blue-600 '
                    href={`/studies`}
                >
                    Back
                </Link>
            </div>
            <main className='flex'>
                <div
                >
                    <h2 className='mt-4 mb-2 text-slate-500'>Surveys:</h2>
                    {isLoading && <div>Loading...</div>}
                    {error && <div className='text-red-500'>
                        Error: {error.message} - Reason: {error.info.error}</div>}

                    {surveyList?.infos ? surveyList.infos.map((survey: any) => {
                        return <div key={survey.surveyKey}>
                            {survey.surveyKey}
                        </div>
                    }) : null}
                </div>
            </main>
        </div>
    )
}
