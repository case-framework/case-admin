'use client';

import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ServiceAccountAPIKey, createServiceAccountAPIKey, deleteServiceAccountAPIKey } from '@/lib/data/service-accounts';
import { CopyIcon, PlusIcon, Trash2 } from 'lucide-react';
import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface ApiKeysProps {
    serviceAccountId: string;
    apiKeys?: ServiceAccountAPIKey[];
    error?: string;
}


const CreateApiKeyDialog = (props: {
    serviceAccountId: string;
}) => {
    const [hasExpiration, setHasExpiration] = useState(false)
    const [expirationDate, setExpirationDate] = useState('')
    const [isPending, startTransition] = useTransition()
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            console.log('submit')

            const resp = await createServiceAccountAPIKey(
                props.serviceAccountId,
                hasExpiration ? new Date(expirationDate).getTime() / 1000 : undefined,
            )
            if (resp.error) {
                console.error(resp.error)
                toast.error('Failed to create API key')
                return
            }
            toast.success('API key created')
            dialogCloseRef.current?.click()
        })

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'outline-solid'}
                    size={'icon'}
                >
                    <PlusIcon className='size-4' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                        Generate a new API key for your service account. You can optionally set an expiration date.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="expiration"
                            checked={hasExpiration}
                            onCheckedChange={setHasExpiration}
                        />
                        <Label htmlFor="expiration">Set expiration date</Label>
                    </div>
                    {hasExpiration && (
                        <div className="space-y-2">
                            <Label htmlFor="expirationDate">Expiration Date</Label>
                            <Input
                                id="expirationDate"
                                type="datetime-local"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className='flex justify-end gap-2'>
                        <LoadingButton
                            isLoading={isPending}
                            type="submit">Generate New API Key</LoadingButton>
                        <DialogClose asChild
                            ref={dialogCloseRef}
                        >
                            <Button type='button' variant={'outline-solid'}>Cancel</Button>
                        </DialogClose>
                    </div>
                </form>

            </DialogContent>
        </Dialog>
    )
}

const ApiKeyItem = (props: {
    apiKey: ServiceAccountAPIKey;
}) => {
    const [isPending, startTransition] = useTransition();

    return (
        <li className='p-4 bg-white rounded-md flex gap-4 items-center'>
            <div className='grow'>
                <p className='font-bold font-mono'>{props.apiKey.key}
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        onClick={() => {
                            navigator.clipboard.writeText(props.apiKey.key)
                            toast.success('API key copied to clipboard')
                        }}
                    >
                        <CopyIcon className='size-4' />
                    </Button>

                </p>
                <p className='text-sm text-muted-foreground'>
                    Created at: <span className='text-foreground'> {props.apiKey.createdAt}</span>
                </p>
                <p className='text-sm text-muted-foreground'>
                    Last used at: <span className='text-foreground'> {props.apiKey.lastUsedAt}</span>
                </p>
                {props.apiKey.expiresAt && (
                    <p className='text-sm text-muted-foreground'>
                        Expires at: <span className='text-foreground'> {props.apiKey.expiresAt}</span>
                    </p>
                )}
            </div>
            <div>
                <LoadingButton
                    variant={'ghost'}
                    size={'icon'}
                    isLoading={isPending}
                    onClick={() => {
                        if (!confirm('Are you sure you want to delete this API key?')) {
                            return;
                        }
                        startTransition(async () => {
                            const resp = await deleteServiceAccountAPIKey(
                                props.apiKey.serviceUserId,
                                props.apiKey.id
                            )
                            if (resp.error) {
                                toast.error('Failed to delete API key')
                                return
                            }
                            toast.success('API key deleted')
                        })
                    }}
                >
                    <span><Trash2 className='size-4' /></span>
                </LoadingButton>
            </div>
        </li>
    );
}

const ApiKeys: React.FC<ApiKeysProps> = (props) => {

    return (
        <Card
            variant={"opaque"}
        >
            <CardHeader >
                <CardTitle>
                    <div className='flex items-center gap-2 justify-between'>
                        API Keys
                        <CreateApiKeyDialog
                            serviceAccountId={props.serviceAccountId}
                        />
                    </div>
                </CardTitle>
            </CardHeader >
            <CardContent>
                {props.error && <p className='text-red-600'>{props.error}</p>}

                {(!props.error && !props.apiKeys) && <p className='text-center font-bold'>This service account has no API keys.</p>}

                <ul className='space-y-4'>
                    {props.apiKeys && props.apiKeys.map(apiKey => {
                        return <ApiKeyItem key={apiKey.id} apiKey={apiKey} />
                    })}
                </ul>
            </CardContent>


        </Card >
    );
};

export default ApiKeys;
