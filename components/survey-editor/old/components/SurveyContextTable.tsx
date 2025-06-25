import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';
import { SurveyContext as ContextValues } from 'survey-engine/data_types';

type SurveyContextTableProps = { contextValues: ContextValues };

export const SurveyContextTable: React.FC<SurveyContextTableProps> = ({ contextValues }) => {

    const { isLoggedIn, participantFlags } = contextValues;
    const contextTableEntries = { isLoggedIn, ...participantFlags };

    return (


        <>
            <Table className='text-xs'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='p-0 h-6 '>Variable</TableHead>
                        <TableHead className='p-0 pl-2 h-6'>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        Object.entries(contextTableEntries).map(([key, value]) => (
                            <TableRow key={key} className='font-mono'>
                                <TableCell className='p-0 h-6'>{key}</TableCell>
                                <TableCell className='p-0 pl-2 h-6'>{value?.toString()}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    );

}
