'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useKeyboardShortcuts } from '@/components/survey-editor/hooks/useKeyboardShortcuts';
import SurveySearch from './survey-search';
import { isMacOs } from 'react-device-detect';


const SearchTrigger: React.FC = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Handle keyboard shortcut (Cmd/Ctrl + K)
    useKeyboardShortcuts({
        onSearch: () => setIsSearchOpen(true),
    });

    const shortcutText = isMacOs ? '⌘K' : 'Ctrl+K';

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSearchOpen(true)}
                        className="px-3 h-[30px] rounded-xl gap-2 bg-white/70 backdrop-blur-xs border border-border hover:bg-white/90"
                    >
                        <Search className="size-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Search</span>

                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 bg-muted rounded-md px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs tracking-widest">
                                {shortcutText}
                            </span>
                        </kbd>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Search survey items</p>
                    <p className="text-xs text-muted-foreground">{shortcutText}</p>
                </TooltipContent>
            </Tooltip>

            <SurveySearch
                isOpen={isSearchOpen}
                onOpenChange={setIsSearchOpen}
            />
        </>
    );
};

export default SearchTrigger;
