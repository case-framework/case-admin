import { cn } from '@/lib/utils';
import { Mail, MoveUpRight, Phone } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ContentLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    href: string;
    prefetch?: boolean;
    iconClassName?: string;

}

const ContentLink: React.FC<ContentLinkProps> = ({
    iconClassName, ...props
}) => {
    const isMail = props.href?.includes('mailto:');
    const isTel = props.href?.includes('tel:');
    const isExternal = props.href?.startsWith('http');


    return (
        <Link
            className='mx-1 inline-flex items-center font-medium underline underline-offset-4 text-primary hover:text-coneno-1 focus:ring-primary focus:ring-3 rounded-sm focus:ring-offset-1 focus:outline-hidden'
            target={isExternal ? '_blank' : undefined}
            rel='noopener noreferrer'
            {...props}>
            {isMail && <span>
                <Mail className={cn('size-4 mr-1', iconClassName)} />
            </span>}
            {isTel && <span>
                <Phone className={cn('size-4 mr-1', iconClassName)} />
            </span>}


            <span>
                {props.children}
            </span>
            {isExternal && <span>
                <MoveUpRight className='size-4 ml-1' />
            </span>}

        </Link>
    );
};

export default ContentLink;
