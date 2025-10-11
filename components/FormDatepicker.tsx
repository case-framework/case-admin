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
    minDate?: Date;
    maxDate?: Date;
}

const FormDatepicker: React.FC<FormDatepickerProps> = ({
    field,
    minDate,
    maxDate,
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "min-w-[200px] w-full pl-3 text-left font-normal",
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
                    disabled={(date) => {
                        if (minDate && date < minDate) {
                            return true;
                        }
                        if (maxDate && date > maxDate) {
                            return true;
                        }
                        return false;
                    }}
                    initialFocus
                    fromDate={minDate}
                    toDate={maxDate}
                />
            </PopoverContent>
        </Popover>
    );
};

export default FormDatepicker;
