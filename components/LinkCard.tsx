import React from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { Card } from '@nextui-org/card'
import Link from 'next/link'



const LinkCard = (props: { href: string, title: string, description: string, icon: React.ReactNode }) => {
    return (<Card
        isPressable
        as={Link}
        href={props.href}
        className="bg-white hover:bg-content2"
    >
        <div className="p-unit-md flex items-center">
            <div className="me-unit-md text-default-400 text-3xl">
                {props.icon}
            </div>
            <div className="grow">
                <h3 className="font-bold text-large">{props.title}</h3>
                <p className="text-default-600 text-small">{props.description}</p>
            </div>
            <div >
                <BsChevronRight />
            </div>
        </div>
    </Card>)
}

export default LinkCard;
