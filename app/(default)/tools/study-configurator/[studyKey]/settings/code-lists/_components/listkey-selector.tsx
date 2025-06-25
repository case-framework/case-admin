"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRef, useCallback } from "react"

interface CustomComboboxProps {
    options: string[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

const CustomCombobox = ({
    options,
    value,
    onChange,
    placeholder = "Select or enter an option...",
}: CustomComboboxProps) => {
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const handleSelect = useCallback(
        (currentValue: string) => {
            onChange(currentValue === value ? "" : currentValue)
            setOpen(false)
        },
        [onChange, value],
    )

    const handleInputChange = useCallback(
        (currentValue: string) => {
            setInputValue(currentValue)
            onChange(currentValue)
        },
        [onChange],
    )

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setOpen(false)
        }
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                style={{ "--radix-popover-trigger-width": triggerRef.current?.offsetWidth + "px" } as React.CSSProperties}
            >
                <Command>
                    <CommandInput
                        placeholder="Search or enter custom value..."
                        value={inputValue}
                        onValueChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <CommandList>
                        <CommandEmpty>No option found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem key={option} value={option} onSelect={handleSelect}>
                                    <Check className={cn("mr-2 h-4 w-4", value === option ? "opacity-100" : "opacity-0")} />
                                    {option}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default CustomCombobox;
