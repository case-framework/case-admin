'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FileText, Hash, Search, TagIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useSurveyEditor } from '@/components/survey-editor/store/useSurveyEditor';
import { useItemNavigation } from '@/components/survey-editor/store/useItemNavigation';
import { SurveyItem } from 'survey-engine';
import { getItemColor, getItemTypeInfos, ItemTypeInfos } from '@/components/survey-editor/utils/item-type-infos';
import ItemTypeIconWithTooltip from './item-editor-card/_components/item-type-icon-with-tooltip';

interface SearchResult {
    item: SurveyItem;
    fullKey: string;
    itemInfos: ItemTypeInfos;
    itemColor?: string;
    matchType: 'key' | 'content' | 'label';
    matchText: string;
}

interface SurveySearchProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const SEARCH_LIMIT = 20;

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
        const addedItems = new Set<string>(); // Track items already added to prevent duplicates
        const searchLower = searchTerm.toLowerCase().trim();

        Object.entries(editor.survey.surveyItems).forEach(([fullKey, item]) => {
            if (!item || !fullKey || addedItems.has(fullKey)) return;

            const itemInfos = getItemTypeInfos(item);
            const itemColor = getItemColor(item);

            if (results.length >= SEARCH_LIMIT) {
                return;
            }

            // Priority 1: Check if key matches (highest priority)
            if (fullKey.toLowerCase().includes(searchLower)) {
                results.push({
                    fullKey,
                    item,
                    itemInfos,
                    itemColor,
                    matchType: 'key',
                    matchText: fullKey,
                });
                addedItems.add(fullKey);
                return; // Exit early since we found a match
            }

            // Priority 2: Check if label matches
            if (item.metadata?.itemLabel?.toLowerCase().includes(searchLower)) {
                results.push({
                    fullKey,
                    item,
                    itemInfos,
                    itemColor,
                    matchType: 'label',
                    matchText: item.metadata.itemLabel || '', // Ensure string type
                });
                addedItems.add(fullKey);
                return; // Exit early since we found a match
            }

            // Priority 3: Check content across all locales (lowest priority)
            const itemTranslations = editor.survey.getItemTranslations(fullKey);
            if (itemTranslations) {
                for (const locale of editor.survey.locales) {
                    const localeValues = itemTranslations.getAllForLocale(locale);
                    if (!localeValues) continue;

                    for (const key of Object.keys(localeValues)) {
                        const content = localeValues[key];
                        if (content?.content?.toLowerCase().includes(searchLower)) {
                            results.push({
                                fullKey,
                                item,
                                itemInfos,
                                itemColor,
                                matchType: 'content',
                                matchText: content.content || '', // Ensure string type
                            });
                            addedItems.add(fullKey);
                            return; // Exit early since we found a match
                        }
                    }
                }
            }
        });

        return results.slice(0, SEARCH_LIMIT);
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
                return <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                    <Hash className="size-3" />
                    Key:
                </span>;
            case 'content':
                return <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                    <FileText className="size-3" />
                    Content:
                </span>;
            case 'label':
                return <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                    <TagIcon className="size-3" />
                    Label:
                </span>;
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
                                const typeInfo = result.itemInfos;
                                const isSelected = index === selectedIndex;

                                return (
                                    <div
                                        key={result.fullKey}
                                        ref={(el) => { resultItemRefs.current[index] = el; }}
                                        className={`px-4 py-3 cursor-pointer space-y-2 ${isSelected ? 'bg-muted' : 'hover:bg-muted/50'
                                            }`}
                                        onClick={() => handleSelect(result)}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <ItemTypeIconWithTooltip
                                                item={result.item}
                                                iconClassName="size-5"
                                            />

                                            <span className="text-sm font-mono grow text-ellipsis font-medium"
                                                style={{
                                                    color: result.itemColor
                                                }}
                                            >
                                                {result.fullKey}
                                            </span>




                                            <span className="text-sm text-muted-foreground">
                                                {result.item.metadata?.itemLabel}
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-2">
                                            {getMatchTypeBadge(result.matchType)}

                                            <div className="text-xs text-foreground truncate">
                                                {highlightMatch(result.matchText, searchTerm)}
                                            </div>
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
