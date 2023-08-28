import React from 'react';
import { BsCheckCircle, BsExclamationTriangle } from 'react-icons/bs';

interface ErrorOrSuccessInlineAlertProps {
    errorMsg?: string;
    successMsg?: string;
}

const ErrorOrSuccessInlineAlert: React.FC<ErrorOrSuccessInlineAlertProps> = ({
    errorMsg,
    successMsg
}) => {

    return (
        <>
            {
                errorMsg && <div
                    className='text-red-600 font-bold flex items-center justify-end'
                    role='alert'
                >
                    <BsExclamationTriangle className='inline-block mr-unit-sm' />
                    {errorMsg}
                </div>}
            {
                successMsg && <div
                    className='text-green-600 font-bold flex items-center justify-end'
                    role='alert'
                >
                    <BsCheckCircle className='inline-block mr-unit-sm' />
                    {successMsg}
                </div>
            }
        </>
    );
};

export default ErrorOrSuccessInlineAlert;
