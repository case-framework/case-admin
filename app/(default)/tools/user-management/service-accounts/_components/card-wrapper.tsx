import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface CardWrapperProps {
    children: React.ReactNode;
}

const CardWrapper: React.FC<CardWrapperProps> = (props) => {
    return (
        <Card
            variant={"opaque"}
            className='max-w-full min-w-80'
        >
            <CardHeader>
                <h2 className='text-lg font-bold flex items-center gap-8 w-full justify-between'>
                    Service Accounts

                    <Button
                        asChild
                        variant={'outline-solid'}
                        size={'icon'}
                    >
                        <Link
                            href={'/tools/user-management/service-accounts/new'}
                        >
                            <PlusIcon className='size-4' />
                        </Link>
                    </Button>
                </h2>

            </CardHeader>
            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    );
};

export default CardWrapper;
