import CaseAdminHeader from '@/components/CaseAdminHeader'
import Link from 'next/link'

export default function Home() {

    return (
        <>
            <main className='flex p-4'>
                <div className='w-1/2'>
                    <CaseAdminHeader
                        appName={process.env.NEXT_PUBLIC_APP_NAME || ''}
                    />
                    <p className='mt-4'>This is the admin tool, to manage studies, surveys, messages and participants.</p>
                </div>
                <div>
                    <h2 className='mb-2 text-slate-500'>Tools:</h2>
                    <Link
                        className='block mb-2 hover:underline text-blue-600 '
                        href='/studies'>
                        Study Tools V1
                    </Link>
                    <Link
                        className='block mb-2 hover:underline text-blue-600 '
                        href='/service-status'>
                        Service Status
                    </Link>
                </div>

            </main>
            <footer
                className='flex justify-center items-center h-16 border-t'
            >
                Credits: <a href='https://www.coneno.com' className='ml-1 hover:underline'>coneno</a>
            </footer>
        </>
    )
}
