'use client';

import LoadingButton from '@/components/loading-button';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarDays, Filter, X } from 'lucide-react';
import { getReportCount, startReportExport, getReportKeys } from '@/lib/data/reports';
import { toast } from 'sonner';

interface ReportDownloaderProps {
    studyKey: string;
}

const ReportDownloader: React.FC<ReportDownloaderProps> = (props) => {
    const router = useRouter();

    const [isCountPending, startCountTransition] = React.useTransition();
    const [isPending, startTransition] = React.useTransition();
    const [reportKeys, setReportKeys] = React.useState<Array<string>>([]);
    const [selectedReportKey, setSelectedReportKey] = React.useState<string>('');

    // Applied filters (used for fetching counts)
    const [appliedParticipantID, setAppliedParticipantID] = React.useState<string>('');
    const [appliedFrom, setAppliedFrom] = React.useState<Date | undefined>(undefined);
    const [appliedUntil, setAppliedUntil] = React.useState<Date | undefined>(undefined);

    // Draft filters (shown in popover, not applied until "Apply" is clicked)
    const [draftParticipantID, setDraftParticipantID] = React.useState<string>('');
    const [draftFrom, setDraftFrom] = React.useState<Date | undefined>(undefined);
    const [draftUntil, setDraftUntil] = React.useState<Date | undefined>(undefined);

    const [type, setType] = React.useState<'csv' | 'raw'>('csv');
    const [fromOpen, setFromOpen] = React.useState(false);
    const [untilOpen, setUntilOpen] = React.useState(false);
    const [filtersOpen, setFiltersOpen] = React.useState(false);
    const [resultCount, setResultCount] = React.useState<number | undefined>(undefined);
    const [hasError, setHasError] = React.useState(false);

    const loadReportKeys = async () => {
        try {
            const resp = await getReportKeys(
                props.studyKey,
                undefined,
                undefined,
                undefined,
            );
            if (resp.error) {
                toast.error('Failed to load report keys', {
                    description: resp.error
                });
                return;
            }
            const keys = resp.reportKeys || [];
            setReportKeys(keys);
            if (!selectedReportKey) {
                // Default to "__all__" if available, otherwise first key
                setSelectedReportKey('__all__');
            }
        } catch (e) {
            console.error(e);
            toast.error('Failed to load report keys');
        }
    };

    useEffect(() => {
        loadReportKeys();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        setDraftParticipantID(appliedParticipantID);
        setDraftFrom(appliedFrom);
        setDraftUntil(appliedUntil);
    }, [filtersOpen, appliedParticipantID, appliedFrom, appliedUntil]);

    // Fetch count when report key or applied filters change
    useEffect(() => {
        if (selectedReportKey) {
            onGetResultCount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedReportKey, appliedParticipantID, appliedFrom, appliedUntil]);

    const onGetResultCount = () => {
        if (!selectedReportKey) {
            setResultCount(undefined);
            return;
        }
        // get count of Reports
        setResultCount(undefined);
        setHasError(false);
        startCountTransition(async () => {
            try {
                const reportKeyForAPI = selectedReportKey === '__all__' ? undefined : selectedReportKey;
                const resp = await getReportCount(
                    props.studyKey,
                    reportKeyForAPI,
                    appliedParticipantID || undefined,
                    appliedFrom,
                    appliedUntil,
                );
                if (resp.error) {
                    toast.error('Failed to get report count', {
                        description: resp.error
                    });
                    setHasError(true);
                    return;
                }
                setResultCount(resp.count);
            } catch (e) {
                console.error(e);
                setHasError(true);
                toast.error('Failed to get report count');
            }
        });
    };

    const onStartExportTask = () => {
        startTransition(async () => {
            try {
                // start export task
                const reportKeyForAPI = selectedReportKey === '__all__' ? undefined : selectedReportKey;
                const resp = await startReportExport(
                    props.studyKey,
                    reportKeyForAPI,
                    appliedParticipantID || undefined,
                    appliedFrom,
                    appliedUntil,
                    type,
                );
                if (resp.error || !resp.task) {
                    toast.error('Failed to start export task', {
                        description: resp.error
                    });
                    return;
                }
                toast.success('Export task started');
                router.push(`/tools/participants/${props.studyKey}/reports/exporter/${resp.task.id}`)
            } catch (e) {
                console.error(e);
                toast.error('Failed to start export task');
            }
        });
    };

    const onApplyFilters = () => {
        // Apply draft filters to applied filters (this will trigger count fetch via useEffect)
        setAppliedParticipantID(draftParticipantID);
        setAppliedFrom(draftFrom);
        setAppliedUntil(draftUntil);
        setFiltersOpen(false);
    };

    const onClearFilters = () => {
        // Clear both draft and applied filters
        setDraftParticipantID('');
        setDraftFrom(undefined);
        setDraftUntil(undefined);
        setAppliedParticipantID('');
        setAppliedFrom(undefined);
        setAppliedUntil(undefined);
        setFiltersOpen(false);
    };

    const hasActiveFilters = Boolean(appliedParticipantID || appliedFrom || appliedUntil);

    return (
        <div className='space-y-4'>
            <div className="flex items-center gap-2">
                <Select
                    value={selectedReportKey}
                    onValueChange={setSelectedReportKey}
                >
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select report key" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">All report keys</SelectItem>
                        {reportKeys.map((rk) => (
                            <SelectItem key={rk} value={rk}>{rk}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="relative">
                            <Filter className="size-4 mr-2" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-2 inline-block size-2 rounded-full bg-primary" />
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" side="right" align="start">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="pid">Participant ID</Label>
                                <Input
                                    id="pid"
                                    value={draftParticipantID}
                                    onChange={(e) => setDraftParticipantID(e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label>From</Label>
                                    <Popover open={fromOpen} onOpenChange={setFromOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start">
                                                <CalendarDays className="size-4 mr-2" />
                                                {draftFrom ? format(draftFrom, 'yyyy-MM-dd') : 'Select'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="start" className="p-0 w-fit">
                                            <Calendar
                                                mode="single"
                                                selected={draftFrom}
                                                onSelect={(date) => {
                                                    setDraftFrom(date);
                                                    if (date) {
                                                        setFromOpen(false);
                                                    }
                                                }}
                                                captionLayout="dropdown"
                                                autoFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Until</Label>
                                    <Popover open={untilOpen} onOpenChange={setUntilOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="justify-start">
                                                <CalendarDays className="size-4 mr-2" />
                                                {draftUntil ? format(draftUntil, 'yyyy-MM-dd') : 'Select'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="start" className="p-0 w-fit">
                                            <Calendar
                                                mode="single"
                                                selected={draftUntil}
                                                onSelect={(date) => {
                                                    setDraftUntil(date);
                                                    if (date) {
                                                        setUntilOpen(false);
                                                    }
                                                }}
                                                captionLayout="dropdown"
                                                autoFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={onClearFilters}>
                                    <X className="size-4 mr-2" /> Clear
                                </Button>
                                <Button size="sm" onClick={onApplyFilters}>Apply</Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="type">Export Type</Label>
                <Select value={type} onValueChange={(value: 'csv' | 'raw') => setType(value)}>
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select export type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="raw">Raw</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {hasError && <p className='text-red-500 text-xs mt-1'>Failed to get report count</p>}
            {isCountPending && <p className='text-xs mt-1'>
                Loading Report count...
            </p>}
            {(!hasError && !isCountPending) && resultCount !== undefined && (
                <p className='text-xs mt-1'>
                    The current query will return {resultCount} reports.
                </p>
            )}

            <div>
                <LoadingButton
                    isLoading={isPending || isCountPending}
                    disabled={!resultCount || resultCount === 0 || !selectedReportKey}
                    onClick={() => {
                        onStartExportTask();
                    }}
                >
                    Start Export
                </LoadingButton>
            </div>
        </div>
    );
};

export default ReportDownloader;
