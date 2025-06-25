import React from 'react';
import { SlotDef, SlotInputDefSimple } from '../utils';
import BuiltInSlotWrapper from './BuiltInSlotWrapper';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

interface DatePickerProps {
    slotDef: SlotDef;
    slotTypeDef: SlotInputDefSimple;
    depth?: number;
    currentValue?: number;
    onValueChange: (value: number) => void;
    onClearSlot: () => void;
}


const DatePicker: React.FC<DatePickerProps> = (props) => {
    const date = props.currentValue ? new Date(props.currentValue * 1000) : undefined;

    return (
        <BuiltInSlotWrapper
            slotLabel={{
                label: props.slotDef.label,
                required: props.slotDef.required
            }}
            slotTypeDef={{
                color: props.slotTypeDef.color,
                icon: props.slotTypeDef.icon,
                label: props.slotTypeDef.label
            }}
            depth={props.depth}
            isInvalid={props.currentValue === undefined || props.currentValue === 0}
            onClearSlot={props.onClearSlot}
        >
            <div className='px-2 py-2'>


                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline-solid"}
                            className={cn(
                                'w-full',
                                "justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => {
                                if (date) {
                                    props.onValueChange(date.getTime() / 1000);
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </BuiltInSlotWrapper>
    );
};

export default DatePicker;
