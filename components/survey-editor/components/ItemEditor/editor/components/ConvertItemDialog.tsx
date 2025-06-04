import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useEffect, useMemo, useRef } from 'react';
import { ItemTypeKey, SurveyItemTypeRegistry, getItemKeyFromFullKey, getItemTypeInfos, getParentKeyFromFullKey } from '../../../../utils/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { SurveyItem } from 'survey-engine/data_types';
import { SurveyItemFeatures, createAndApplyFeatures, supportedSurveyItemFeaturesByType, surveyItemFeatureLookup, surveyItemFeaturesLabels, surveyItemFeaturesList } from './item-transformations';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PopoverKeyBadge } from './KeyBadge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';


interface ConvertItemDialogProps {
    open: boolean;
    surveyItem: SurveyItem;
    surveyItemList: Array<{ key: string, isGroup: boolean }>;
    onClose: () => void;
    onItemConverted?: (newConvertedItem: SurveyItem) => void;
}

const allSurveyItemTargetTypes = [
    //SpecialSurveyItemTypeInfos.groupItem,
    //SpecialSurveyItemTypeInfos.pageBreak,
    //SpecialSurveyItemTypeInfos.surveyEnd,
    ...SurveyItemTypeRegistry.map((re) => ({
        key: re.key,
        label: re.label,
        description: re.description,
        defaultItemClassName: re.className,
        icon: re.icon,
    }))
];

const lookupValidation = (result: unknown) => {
    if (result === undefined) {
        return false;
    }
    if (Array.isArray(result)) {
        return result.length > 0;
    }
    return true;
}

const KeyConfigCell: React.FC<{ sourceItem: SurveyItem, otherKeys: string[], initialKey: string, onKeyChange: (key: string) => void }> = (props) => {
    return (
        <div className='flex flex-row items-center justify-center'>
            <PopoverKeyBadge allOtherKeys={props.otherKeys} itemKey={props.initialKey} onKeyChange={(key) => { props.onKeyChange(key) }} isHighlighted={true} />
        </div>
    );
}

const FeatureConfigCell: React.FC<{ sourceItem: SurveyItem, feature: SurveyItemFeatures, otherKeys: string[], initiallyIsConfigured: boolean, onConfigChange: (isConfigured: boolean) => void }> = (props) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [checked, setChecked] = React.useState<boolean>(props.initiallyIsConfigured);

    const checkedChange = (value: boolean) => {
        setChecked(value);
        props.onConfigChange(value);
    }

    switch (props.feature) {
        default:
            return (<div
                className='flex flex-row justify-center items-center h-12 gap-2'
                onClick={(e) => {
                    checkedChange(!checked);
                    e.stopPropagation();
                }}
            >
                <Checkbox
                    id={'check-' + props.feature}
                    ref={ref}
                    checked={checked}
                    onCheckedChange={(v) => checkedChange(v === true)}
                />
                <Label className="text-sm font-normal" htmlFor={'check-' + props.feature} onClick={(e) => { e.preventDefault(); }}>
                    Copy
                </Label>
            </div>);
    }
}

const getInitialNewKey = (sourceKey: string, otherKeys: string[]): string => {
    let newKey = getItemKeyFromFullKey(sourceKey) + "_conv";
    let i = 1;
    while (otherKeys.includes(newKey)) {
        newKey = getItemKeyFromFullKey(sourceKey) + "_conv_" + i;
        i++;
    }
    return newKey;
}

const getInitialConfig = (sourceItem: SurveyItem, sourceType: ItemTypeKey, targetType: ItemTypeKey): Record<SurveyItemFeatures, boolean> => {
    let availableFeatures = surveyItemFeaturesList().filter(
        (feature) => supportedSurveyItemFeaturesByType[sourceType].includes(feature)
            && supportedSurveyItemFeaturesByType[targetType].includes(feature)
            && lookupValidation(surveyItemFeatureLookup[feature](sourceItem)));

    if (sourceType !== targetType) {
        availableFeatures = availableFeatures.filter((feature) => feature != SurveyItemFeatures.ResponseGroup);
    } else {
        availableFeatures = availableFeatures.filter(
            (feature) => !([SurveyItemFeatures.ChoiceOptions,
            SurveyItemFeatures.ChoiceRows,
            SurveyItemFeatures.InputLabel,
            SurveyItemFeatures.InputPlaceholder,
            SurveyItemFeatures.InputProperties,
            SurveyItemFeatures.InputStyling].includes(feature)));
    }
    return Object.fromEntries(availableFeatures.map((feature) => [feature, true])) as Record<SurveyItemFeatures, boolean>;
}

const ConvertFeaturesTable: React.FC<{
    sourceItem: SurveyItem,
    sourceType: ItemTypeKey,
    targetType: ItemTypeKey,
    targetKey: string,
    targetConfig: Record<SurveyItemFeatures, boolean>,
    onTargetKeyChange?: (key: string) => void,
    onTargetConfigChange?: (newRecords: Record<SurveyItemFeatures, boolean>) => void,
    otherKeys: string[],
}> = (props) => {

    return (<Table>
        <TableHeader>
            <TableRow>
                <TableHead className="text-center">Feature</TableHead>
                <TableHead className="text-center">Use</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow key={'key'}>
                <TableCell className="text-center w-1/2">{"Item Key"}</TableCell>
                <TableCell className="text-center p-0">
                    <KeyConfigCell
                        sourceItem={props.sourceItem}
                        otherKeys={props.otherKeys}
                        initialKey={props.targetKey}
                        onKeyChange={(key) => {
                            if (props.onTargetKeyChange) {
                                props.onTargetKeyChange(key);
                            }
                        }}
                    />
                </TableCell>
            </TableRow>
            {Object.entries(props.targetConfig).map(([key, value]) => {
                return (
                    <TableRow key={key}>
                        <TableCell className="text-center w-1/2">{surveyItemFeaturesLabels[key as SurveyItemFeatures]}</TableCell>
                        <TableCell className="text-center p-0">
                            <FeatureConfigCell
                                sourceItem={props.sourceItem}
                                feature={key as SurveyItemFeatures}
                                otherKeys={props.otherKeys}
                                onConfigChange={(isConfigured) => {
                                    if (props.onTargetConfigChange) {
                                        const config = { ...props.targetConfig };
                                        config[key as SurveyItemFeatures] = isConfigured;
                                        props.onTargetConfigChange(config);
                                    }
                                }}
                                initiallyIsConfigured={value} />
                        </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    </Table>);
}

const ConvertItemDialog: React.FC<ConvertItemDialogProps> = (props) => {
    const relevantKeys = useMemo(() => props.surveyItemList.filter(i => getParentKeyFromFullKey(i.key) == getParentKeyFromFullKey(props.surveyItem.key)).map(i => getItemKeyFromFullKey(i.key)), [props.surveyItemList, props.surveyItem.key]);
    const itemTypeInfos = useMemo(() => getItemTypeInfos(props.surveyItem), [props.surveyItem]);

    const [targetType, setTargetType] = React.useState<ItemTypeKey>(itemTypeInfos.key);
    const [targetKey, setTargetKey] = React.useState<string>(getInitialNewKey(props.surveyItem.key, relevantKeys));
    const [targetConfig, setTargetConfig] = React.useState<Record<SurveyItemFeatures, boolean>>(getInitialConfig(props.surveyItem, itemTypeInfos.key, targetType));

    // Should run when source or target types change
    useEffect(() => {
        setTargetConfig(getInitialConfig(props.surveyItem, itemTypeInfos.key, targetType));
    }, [props.surveyItem, itemTypeInfos, targetType]);

    // Should run when the item changes
    useEffect(() => {
        setTargetType(itemTypeInfos.key);
        setTargetKey(getInitialNewKey(props.surveyItem.key, relevantKeys));
    }, [props.surveyItem.key, relevantKeys, itemTypeInfos.key]);

    return (
        <Dialog
            open={props.open}
            onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <DialogContent className="w-[640px] max-w-none">
                <DialogHeader>
                    <DialogTitle>
                        Convert item:
                        <span className='ms-2 font-mono'>
                            {String(props.surveyItem.key || '')}
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-row items-center justify-center'>
                        <div className='w-64'>
                            <p className='text-sm mb-1'>
                                From
                            </p>
                            <div className='flex flex-row items-center gap-2 border rounded-lg px-3 h-10 text-sm'>
                                <itemTypeInfos.icon
                                    className='size-4'
                                />
                                {itemTypeInfos.label}
                            </div>
                        </div>
                        <div className='self-end flex flex-col items-center justify-center h-10 grow'>
                            <ArrowRight className='size-6' />
                        </div>
                        <div className='w-64'>
                            <p className='text-sm mb-1'>
                                To
                            </p>
                            <Select
                                value={targetType}
                                onValueChange={(value) => {
                                    setTargetType(value as ItemTypeKey);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allSurveyItemTargetTypes.map(typeInfo => (
                                        <SelectItem
                                            key={typeInfo.key}
                                            value={typeInfo.key}
                                        >
                                            <div className='flex flex-row items-center gap-2'>
                                                <typeInfo.icon
                                                    className='size-4'
                                                />
                                                {typeInfo.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator />
                    <p className='text-sm'>Configure features:</p>
                    <ConvertFeaturesTable
                        sourceItem={props.surveyItem}
                        sourceType={itemTypeInfos.key}
                        targetType={targetType}
                        otherKeys={relevantKeys}
                        targetKey={targetKey}
                        targetConfig={targetConfig}
                        onTargetKeyChange={(key) => {
                            setTargetKey(key);
                        }}
                        onTargetConfigChange={(newRecords) => {
                            setTargetConfig(newRecords);
                        }
                        }
                    />
                </div>

                <DialogFooter>
                    <Button
                        variant={'outline'}
                        onClick={() => {
                            props.onClose()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            const newItem = createAndApplyFeatures(
                                props.surveyItem,
                                [...Object.keys(targetConfig).filter((key) => targetConfig[key as SurveyItemFeatures] == true).map((key) => key as SurveyItemFeatures)],
                                targetType,
                                targetKey,
                            );
                            if (newItem) props.onItemConverted?.(newItem);
                            props.onClose();
                        }}
                    >
                        Convert
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConvertItemDialog;
