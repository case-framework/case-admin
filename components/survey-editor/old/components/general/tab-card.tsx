import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';

interface TabCardProps {
    tabs: Array<{
        label: string,
        icon?: React.ReactNode,
        content: React.ReactNode
    }>;
    selectedTab?: string;
    onTabSelect?: (tabLabel: string) => void;
}

const TabCard: React.FC<TabCardProps> = (props) => {
    return (
        <div className='p-0 w-full grow'>
            <Tabs
                className="h-full flex flex-col"
                defaultValue={(props.selectedTab ?? props.tabs[0].label).toLowerCase()}
                onValueChange={(value) => {
                    props.onTabSelect?.(value);
                }}
            >
                <div className='flex justify-start border-b border-border'>
                    <TabsList className='flex flex-wrap justify-start p-0  pt-0.5 h-auto bg-transparent gap-1 w-full rounded-none'>
                        {props.tabs.map(tab => (
                            <TabsTrigger value={tab.label.toLowerCase()} key={tab.label}
                                className='rounded-none text-xs py-1 rounded-t-md shadow-none border-t border-s border-e border-border drop-shadow-none data-[state=active]:shadow-none mb-[-1px] data-[state=active]:ring-offset-0'
                            >
                                <span>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </TabsTrigger>
                        ))}

                    </TabsList>
                </div>

                {props.tabs.map(tab => (
                    <TabsContent
                        key={tab.label}
                        value={tab.label.toLowerCase()}
                        className='grow mt-0 border-l border-r border-b border-border rounded-b-md bg-white'
                    >
                        {tab.content}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default TabCard;
