'use client';
import ErrorAlert from '@/components/ErrorAlert';
import React from 'react';


const error: React.FC = () => {
    return (
        <div className='py-4'>
            <ErrorAlert
                title="Error loading participants"
                error="Try again later. If the problem persists, contact your admin."
            />
        </div>
    );
};

export default error;
