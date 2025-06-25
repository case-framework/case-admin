import React from 'react';
import CardWrapper from './card-wrapper';
import { getServiceAccounts } from '@/lib/data/service-accounts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';


const ServiceAccounts: React.FC = async () => {
    const response = await getServiceAccounts();

    const error = response.error;
    if (error) {
        return (
            <CardWrapper>
                <div className='px-6 py-3 bg-red-100 rounded-md text-red-700'>
                    <h3 className='font-bold'>Unexpected error: </h3>
                    {error}
                </div>
            </CardWrapper>
        );
    }

    if (!response.serviceAccounts || response.serviceAccounts.length === 0) {
        return (
            <CardWrapper>
                <div className='px-6 py-3 bg-muted rounded-md'>
                    <h3 className='font-bold'>No service accounts added</h3>
                </div>
            </CardWrapper>
        );
    }

    return (
        <CardWrapper>
            <ul className='space-y-4'>
                {response.serviceAccounts.map((serviceAccount) => (<li
                    key={serviceAccount.id}
                >
                    <Button

                        asChild
                        className='w-full justify-between gap-2 items-center h-fit overflow-x-hidden'
                        variant={'outline-solid'}

                    >
                        <Link
                            href={`/tools/user-management/service-accounts/${serviceAccount.id}`}
                        >
                            <span className='max-w-[300px] truncate'>
                                <span className='block font-bold'>
                                    {serviceAccount.label}
                                </span>
                                <span className='text-xs'>
                                    {serviceAccount.description}
                                </span>
                            </span>
                            <ChevronRightIcon className='text-muted-foreground size-4' />
                        </Link>
                    </Button>
                </li>)
                )}
            </ul>
        </CardWrapper>
    );
};

export default ServiceAccounts;
