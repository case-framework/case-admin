import { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { SurveyBasicInfoForm } from './forms/SurveyBasicInfoForm';
import { SurveyAccessForm } from './forms/SurveyAccessForm';

import { Button } from '@/components/ui/button';
import MaxItemsPerPage from './forms/max-items-per-page';


const SurveyProperties: React.FC = () => {
    const [formIndex, setFormIndex] = useState(0);

    const formItems = [
        {
            title: "Basic Information",
            form: <SurveyBasicInfoForm />,

        },
        {
            title: "Access Conditions",
            form: <SurveyAccessForm />,
        },
        {
            title: "Max items per page",
            form: <MaxItemsPerPage />,
        }
    ];

    return (
        <div className='md:p-6 overflow-auto'>
            <section className='grow md:rounded-[0.5rem] md:border md:shadow mx-auto max-w-screen-lg bg-white'>
                <div className="space-y-6 p-6">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold tracking-tight">Survey Properties</h2>
                        <p className="text-muted-foreground">
                            Manage the properties of the currently opened survey file.
                        </p>
                    </div>
                    <Separator className="my-6" />
                    <div className="flex flex-row">
                        <aside className="pr-6 border-r border-border ">
                            <ul className='space-y-2'>
                                {formItems.map((item, index) => (
                                    <li key={index.toString()}>
                                        <Button
                                            variant={index === formIndex ? 'secondary' : 'ghost'}
                                            className="justify-start"
                                            onClick={() => setFormIndex(index)}
                                        >
                                            {item.title}
                                        </Button>
                                    </li>
                                ))}

                            </ul>
                        </aside>

                        <div className="grow space-y-6 pl-6">
                            {formItems[formIndex].form}
                        </div>
                    </div>

                </div >
            </section >
        </div >

    )
};

export default SurveyProperties;
