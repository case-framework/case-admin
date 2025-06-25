import { Mail, MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ContentLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    href: string;
    prefetch?: boolean;

}

const ContentLink: React.FC<ContentLinkProps> = (props) => {
    const isMail = props.href?.includes('mailto:');
    const isExternal = props.href?.startsWith('http');

    return (
        <Link
            className='inline-flex items-center font-medium underline underline-offset-4 text-primary hover:text-primary/80 focus:ring-primary focus:ring-3 rounded-sm focus:ring-offset-1 focus:outline-hidden'
            target={isExternal ? '_blank' : undefined}
            rel='noopener noreferrer'
            {...props}>
            {isMail && <span>
                <Mail className='size-4 mx-1' />
            </span>}
            <span>
                {props.children}
            </span>
            {isExternal && <span>
                <MoveUpRight className='size-4 mx-1' />
            </span>}

        </Link>
    );
};

export default ContentLink;

// <ArrowUpRightIcon className='inline-block w-4 h-4 ms-1' />
