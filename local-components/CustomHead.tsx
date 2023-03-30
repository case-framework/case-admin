import Head from 'next/head';
import React from 'react';

interface HeadProps {
}

const CustomHead: React.FC<HeadProps> = (props) => {
    return (
        <Head >
            <title>Infectieradar Admin</title>
            <meta name="description" content="Admin Tool for the Infectieradar platform" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
};

export default CustomHead;
