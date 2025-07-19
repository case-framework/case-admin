'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Command } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSurveyEditor } from '@/components/survey-editor/store/useSurveyEditor';
import { useItemNavigation } from '@/components/survey-editor/store/useItemNavigation';
import { SurveyItem, SurveyItemKey } from 'survey-engine';
import { getItemTypeInfos } from '@/components/survey-editor/utils/item-type-infos';

interface SearchResult {
    item: SurveyItem;
    fullKey: string;
    itemKey: string;
    matchType: 'key' | 'translation' | 'label';
    matchText: string;
}

interface SurveySearchProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const SurveySearch: React.FC<SurveySearchProps> = ({ isOpen, onOpenChange }) => {
    const { editor } = useSurveyEditor();
    const { navigateToItem } = useItemNavigation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const resultsContainerRef = useRef<HTMLDivElement>(null);
    const resultItemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Get all survey items and search through them
    const searchResults = useMemo(() => {
        if (!editor?.survey?.surveyItems || !searchTerm.trim()) {
            return [];
        }

        const results: SearchResult[] = [];
        const searchLower = searchTerm.toLowerCase().trim();

        Object.entries(editor.survey.surveyItems).forEach(([fullKey, item]) => {
            if (!item || !fullKey) return;

            const itemKeyObj = SurveyItemKey.fromFullKey(fullKey);
            const itemKey = itemKeyObj.itemKey;

            if (fullKey.toLowerCase().includes(searchLower)) {
                results.push({
                    item,
                    fullKey,
                    itemKey,
                    matchType: 'key',
                    matchText: fullKey,
                });
            }
        });
        /* Object.entries(editor.survey.surveyItems).forEach(([fullKey, item]) => {
            if (!item || !fullKey) return;

            try {
                const itemKeyObj = SurveyItemKey.fromFullKey(fullKey);
                const itemKey = itemKeyObj.itemKey;

                // Search in full key
                if (fullKey.toLowerCase().includes(searchLower)) {
                    results.push({
                        item,
                        fullKey,
                        itemKey,
                        matchType: 'key',
                        matchText: fullKey,
                    });
                    return;
                }

                // Search in item key
                if (itemKey.toLowerCase().includes(searchLower)) {
                    results.push({
                        item,
                        fullKey,
                        itemKey,
                        matchType: 'key',
                        matchText: itemKey,
                    });
                    return;
                }

                // Search in translations
                try {
                    const itemTranslations = editor.survey.getItemTranslations(fullKey);
                    if (itemTranslations) {
                        // Check all available locales
                        const availableLocales = itemTranslations.getAvailableLocales();
                        for (const locale of availableLocales) {
                            // Check title translations
                            const titleContent = itemTranslations.getContent(locale, 'title');
                            if (titleContent?.content && titleContent.content.toLowerCase().includes(searchLower)) {
                                results.push({
                                    item,
                                    fullKey,
                                    itemKey,
                                    matchType: 'translation',
                                    matchText: titleContent.content,
                                });
                                return;
                            }

                            // Check subtitle translations
                            const subtitleContent = itemTranslations.getContent(locale, 'subtitle');
                            if (subtitleContent?.content && subtitleContent.content.toLowerCase().includes(searchLower)) {
                                results.push({
                                    item,
                                    fullKey,
                                    itemKey,
                                    matchType: 'translation',
                                    matchText: subtitleContent.content,
                                });
                                return;
                            }
                        }
                    }
                } catch (error) {
                    // Continue if translations are not available
                }

                // Search in components (labels)
                if (item.components?.items) {
                    for (const component of item.components.items) {
                        if (component.translations) {
                            for (const [locale, translations] of Object.entries(component.translations)) {
                                for (const [key, value] of Object.entries(translations)) {
                                    if (typeof value === 'string' && value.toLowerCase().includes(searchLower)) {
                                        results.push({
                                            item,
                                            fullKey,
                                            itemKey,
                                            matchType: 'label',
                                            matchText: value,
                                        });
                                        return;
                                    }
                                }
                            }
                        }

                        // Also search in component content if it's a string
                        if (typeof component.content === 'string' && component.content.toLowerCase().includes(searchLower)) {
                            results.push({
                                item,
                                fullKey,
                                itemKey,
                                matchType: 'label',
                                matchText: component.content,
                            });
                            return;
                        }
                    }
                } catch (error) {
                    // Skip items that can't be processed
                    console.warn('Error processing survey item:', fullKey, error);
                }
            });
 */
        return results.slice(0, 10); // Limit to 10 results
    }, [editor?.survey, searchTerm]);

    const handleSelect = useCallback((result: SearchResult) => {
        navigateToItem(result.fullKey);
        onOpenChange(false);
        setSearchTerm('');
        setSelectedIndex(0);
    }, [navigateToItem, onOpenChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (searchResults[selectedIndex]) {
                handleSelect(searchResults[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            onOpenChange(false);
        }
    }, [searchResults, selectedIndex, handleSelect, onOpenChange]);

    // Reset selected index when search term changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [searchTerm]);

    // Clear search when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Update refs array length when search results change
    useEffect(() => {
        resultItemRefs.current = resultItemRefs.current.slice(0, searchResults.length);
    }, [searchResults.length]);

    // Scroll selected item into view
    useEffect(() => {
        const selectedElement = resultItemRefs.current[selectedIndex];
        if (selectedElement && resultsContainerRef.current) {
            selectedElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [selectedIndex, searchResults.length]);

    const getMatchTypeBadge = (matchType: SearchResult['matchType']) => {
        switch (matchType) {
            case 'key':
                return <Badge variant="outline" className="text-xs">Key</Badge>;
            case 'translation':
                return <Badge variant="outline" className="text-xs">Translation</Badge>;
            case 'label':
                return <Badge variant="outline" className="text-xs">Label</Badge>;
            default:
                return null;
        }
    };

    const highlightMatch = (text: string, searchTerm: string) => {
        if (!searchTerm.trim()) return text;

        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 rounded px-0.5">
                    {part}
                </mark>
            ) : part
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 border-border overflow-hidden">
                <DialogTitle className="sr-only">Search Survey Items</DialogTitle>
                <div className="flex flex-col">
                    {/* Search Header */}
                    <div className="flex items-center px-4 py-3 pe-12 border-b border-border">
                        <Search className="size-5 text-muted-foreground mr-2" />
                        <Input
                            placeholder="Search survey items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="focus-visible:ring-0 text-sm"
                            autoFocus
                        />
                        <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">↑↓</kbd>
                            to navigate
                            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded ml-1">↵</kbd>
                            to select
                        </div>
                    </div>

                    {/* Search Results */}
                    <div ref={resultsContainerRef} className="max-h-96 overflow-y-auto divide-y divide-border">
                        {searchResults.length > 0 ? (
                            searchResults.map((result, index) => {
                                const typeInfo = getItemTypeInfos(result.item);
                                const isSelected = index === selectedIndex;

                                return (
                                    <div
                                        key={result.fullKey}
                                        ref={(el) => { resultItemRefs.current[index] = el; }}
                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${isSelected ? 'bg-muted' : 'hover:bg-muted/50'
                                            }`}
                                        onClick={() => handleSelect(result)}
                                    >
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <typeInfo.icon className="w-4 h-4 text-muted-foreground" />
                                            {getMatchTypeBadge(result.matchType)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-sm text-muted-foreground">
                                                    {highlightMatch(result.fullKey, searchTerm)}
                                                </span>
                                            </div>

                                            <div className="text-sm text-foreground truncate">
                                                {highlightMatch(result.matchText, searchTerm)}
                                            </div>

                                            {result.matchType !== 'key' && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    in {result.matchType}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : searchTerm.trim() ? (
                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                No items found for "{searchTerm}"
                            </div>
                        ) : (
                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                Start typing to search survey items...
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SurveySearch;
