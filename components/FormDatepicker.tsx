import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { FormControl } from './ui/form';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';

interface FormDatepickerProps {
    field: {
        name: string;
        value: Date | undefined;
        onChange: (date?: Date) => void;
    };
}

const FormDatepicker: React.FC<FormDatepickerProps> = ({
    field
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant={"outline-solid"}
                        className={cn(
                            "min-w-[240px] w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                        )}
                    >
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto size-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    id={field.name}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                        date > new Date() || date < new Date("2020-01-01")
                    }
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export default FormDatepicker;
