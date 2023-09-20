import { Accordion, AccordionItem } from '@nextui-org/react';
import React from 'react';
import { Disclosure, Transition } from '@headlessui/react'
import { BsChevronRight } from 'react-icons/bs';

export interface AttributeGroup {
    key: string;
    title: string | React.ReactNode;
    icon?: React.ReactNode;
    content: React.ReactNode;
    defaultOpen?: boolean;
}

interface AttributeGroupsAccordionProps {
    attributeGroups: Array<AttributeGroup>;
}

const AttributeGroupsAccordion: React.FC<AttributeGroupsAccordionProps> = (props) => {
    return (
        <>
            {props.attributeGroups.map(group => (
                <Disclosure
                    key={group.key}
                    as={'div'}
                    defaultOpen={group.defaultOpen}
                >
                    <Disclosure.Button
                        className='flex items-center gap-unit-sm py-unit-sm border-b ui-not-open:border-default-200 w-full'
                    >
                        <span className='text-secondary-300'>
                            {group.icon}
                        </span>
                        <span className='font-bold text-small text-start grow'>
                            {group.title}
                        </span>
                        <span>
                            <BsChevronRight className='text-secondary-300 ui-open:rotate-90 transition' />
                        </span>
                    </Disclosure.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Disclosure.Panel
                            className='pb-unit-lg pt-unit-2'
                        >
                            <div className='space-unit-sm px-unit-sm border-s-4 border-secondary-200 bg-default-50 py-unit-sm rounded-r-small shadow-md'>
                                {group.content}
                            </div>
                        </Disclosure.Panel>
                    </Transition>
                </Disclosure>
                /*<AccordionItem
                    key={group.key}
                    title={group.title}
                    startContent={<span className='text-secondary-300'>
                        {group.icon}
                    </span>}
                    textValue={'accordion-item-' + group.key}
                    classNames={{
                        title: 'font-bold text-small',
                        content: 'pb-unit-lg'
                    }}
                >
                    <div className='space-unit-sm px-unit-sm border-s-4 border-secondary-200'

                    >
                        {group.content}
                    </div>
                </AccordionItem>*/
            ))}
        </>
    );
};

export default AttributeGroupsAccordion;
