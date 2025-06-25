'use client';

import { Button } from '@/components/ui/button';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { getCategoryPathBySlug } from './utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SearchResult } from '@/app/api/docs/search/route';



const SearchDocs: React.FC = () => {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = useDebounceValue('', 500)
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [searchResults, setSearchResults] = React.useState<Array<{
        slug: string,
        title: string,
        category: string,
        subcategory: string,
    }>>([])


    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        console.log('search', search)
        const getSearch = async () => {
            startTransition(async () => {
                try {
                    const resp = await fetch('/api/docs/search?q=' + search, {
                        next: { revalidate: 0 }
                    })
                    const data = await resp.json()
                    setSearchResults(data.results.map((result: SearchResult) => result.item))

                } catch (e) {
                    console.error(e)
                }
            })

        }
        getSearch()
    }, [search])


    return (
        <>
            <Button
                className='w-full justify-between h-fit px-3 py-1.5 rounded-lg '
                variant='outline'
                onClick={() => setOpen(true)}
            >
                <span className='mr-4 text-muted-foreground/80 text-xs'>
                    Search docs... {" "}
                </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden p-0 shadow-lg gap-0 space-y-0">

                    <div className="relative flex items-center border-b px-3" cmdk-input-wrapper="">
                        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />

                        <input
                            className='flex h-11 w-full rounded-md bg-transparent py-3 text-sm ring-none outline-hidden placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400'
                            defaultValue={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search docs..."
                        />
                        {isPending &&
                            <Loader2Icon className='animate-spin size-4 text-muted-foreground/70 absolute top-4 right-10 z-10' />
                        }
                    </div>

                    <ul className='min-h-16 p-1 space-y-1 divide-y max-h-64 overflow-y-auto'>
                        {isPending && <div className='flex items-center gap-2 justify-center py-6'>
                            <Loader2Icon className='animate-spin size-4 text-muted-foreground/70' />
                            <span className=''>Searching...</span>
                        </div>}

                        {
                            (!isPending && searchResults.length === 0) && <div className='flex items-center gap-2 justify-center py-6'>
                                No results found.
                            </div>
                        }

                        {searchResults.map((result, index) => (
                            <li key={index}>
                                <Button
                                    className='w-full justify-start h-auto text-start'
                                    onClick={() => {
                                        router.push('/docs/' + result.slug)
                                        setOpen(false)
                                    }}
                                    variant={'ghost'}
                                >
                                    <div>
                                        <div className='text-xs text-muted-foreground'>{getCategoryPathBySlug(result.slug).join(' / ')}</div>
                                        <div>{result.title}</div>
                                    </div>
                                </Button>

                            </li>
                        ))}
                    </ul>


                </DialogContent>
            </Dialog>
        </>
    );
};

export default SearchDocs;
