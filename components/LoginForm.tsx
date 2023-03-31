import React, { ReactElement, useState } from 'react';
import Button from './buttons/Button';
import PrimaryOutlinedButton from './buttons/PrimaryOutlinedButton';
import LoadingButton from './buttons/LoadingButton';
import ShieldCheckIcon from '@heroicons/react/24/outline/ShieldCheckIcon';
import { signIn } from 'next-auth/react';
import Input from './inputs/Input';

interface LoginFormProps {
    isSecondFactor: boolean;
    isLoading: boolean;
    loginData: {
        email: string;
        verificationCode: string;
        password: string;
    };
    setLoginData: (loginData: {
        email: string;
        verificationCode: string;
        password: string;
    }) => void;
    handleLogin: () => void;
    hasError?: boolean;
    errorMsg?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLoginData, loginData, isLoading, isSecondFactor, handleLogin, hasError, errorMsg, ...props }) => {

    if (isSecondFactor) {
        return (
            <div>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    handleLogin();
                }} >
                    <label className="block mt-4">
                        <span className="text-gray-700">6 digit code</span>
                        <Input type="text"
                            onChange={(event) => {
                                setLoginData({
                                    ...loginData,
                                    verificationCode: event.target.value.replaceAll('-', '')
                                })
                            }}
                            hasError={hasError} errorMsg="Wrong verification code"></Input>

                    </label>
                    <Button >Submit</Button>
                </form>
            </div>);
    }
    return (
        <div className='mt-10'>
            <h2 className='text-3xl'>Login</h2>
            <form onSubmit={(event) => {
                event.preventDefault();
                handleLogin();
            }} >
                <label className="block mt-4">
                    <span className="text-gray-700">Email</span>
                    <Input type="email"
                        autoComplete='email'
                        onChange={(event) => {
                            setLoginData({
                                ...loginData,
                                email: event.target.value
                            })
                        }}
                        hasError={hasError}></Input>

                </label>
                <label className="block mt-4">
                    <span className="text-gray-700">Password</span>
                    <Input type="password"
                        autoComplete='current-password'
                        onChange={(event) => {
                            setLoginData({
                                ...loginData,
                                password: event.target.value
                            })
                        }}
                        hasError={hasError} errorMsg="Wrong email or password"></Input>
                </label>

                <LoadingButton
                    isLoading={isLoading}
                    type='submit'
                >
                    Login
                </LoadingButton>
            </form>

            <div className='flex row items-center my-4'>
                <div className='border-t border-t-gray-400 grow h-[1px]'></div>
                <span className='px-2 text-gray-400'>OR</span>
                <div className='border-t border-t-gray-400 grow h-[1px]'></div>
            </div>

            <PrimaryOutlinedButton
                className='mt-2 w-full'
                type='button'
                onClick={() => {
                    signIn('management-user-oauth', { redirect: true, callbackUrl: '/dashboard' });
                }}
            >
                <ShieldCheckIcon className="h-6 w-6 mr-2" />
                Login Via Institute Account
            </PrimaryOutlinedButton>

        </div>
    );

}


export default LoginForm;
