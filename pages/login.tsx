import { useSession, signIn, signOut } from "next-auth/react";
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/router'
import Button from '@/components/buttons/Button';
import { useState } from 'react';
import { ERROR_SECOND_FACTOR_NEEDED } from '@/utils/server/types/authAPI';
import LoginForm from '@/components/LoginForm';


export default function Login() {
    const { data: session, status } = useSession()
    const router = useRouter();

    const callBackURL = router.query.callbackUrl || '/';

    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        verificationCode: ''
    });

    const [isSecondFactor, setIsSecondFactor] = useState(false);
    const [isError, setError] = useState(false);


    console.log(session, status)
    if (session?.error === 'RefreshAccessTokenError') {
        signOut();
    }

    if (status === 'loading') {
        return <div className='h-screen bg-slate-100 flex justify-center items-center'>
            <Spinner size='xl' />
        </div>
    }

    if (status === 'authenticated') {
        return <div className='h-screen bg-slate-100 flex justify-center items-center'>
            <div className='bg-white rounded shadow p-6'>
                <h1 className=' text-gray-600 mb-2'>You are logged in as:</h1>
                <p className='text-2xl font-bold'>{session.user?.email}</p>
                <div className='flex space-x-4'>
                    <Button onClick={() => router.push('/studies')}>Go to dashboard</Button>
                    <Button onClick={() => signOut()}>Logout</Button>
                </div>
            </div>
        </div>
    }

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res = await signIn('case-credentials', {
                email: loginData.email,
                password: loginData.password,
                redirect: true,
                verificationCode: loginData.verificationCode,
                callbackUrl: callBackURL as string,
            });
            console.log(res)
            if (!res) {
                return
            }
            if (res.ok === false) {
                setError(true);

            } else {
                if (res.url) {
                    router.push(res.url);
                }
                setError(false);
            }
            if (res.error === ERROR_SECOND_FACTOR_NEEDED) {
                setError(false);
                setIsSecondFactor(true);
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <main className='h-screen bg-blue-500 bg-repeat bg-[length:350px_350px] bg-[url(/images/random-shapes.svg)]'>

                <div className='h-full drop-shadow-[5px_0px_8px_rgba(0,0,0,0.25)]'>
                    <div className='h-full md:right-clipped bg-slate-100 sm:w-full md:w-9/12 lg:w-7/12 flex flex-col align-middle'>


                        <div className='px-10 m-auto w-[500px]'>
                            <div className='border-l-[5px] border-l-blue-600 px-4'>
                                <h1 className='text-2xl'>
                                    <span className='font-normal text-blue-600 text-lg'>CASE ADMIN</span> <br />
                                    <span className='font-semibold tracking-wider'>Infectieradar</span>
                                </h1>
                            </div>


                            <LoginForm isSecondFactor={isSecondFactor} isLoading={isLoading}
                                loginData={loginData} handleLogin={handleLogin}
                                setLoginData={setLoginData}
                                hasError={isError}
                            ></LoginForm>

                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}
