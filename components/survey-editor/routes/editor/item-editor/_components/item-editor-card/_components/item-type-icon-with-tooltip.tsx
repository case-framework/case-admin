import { SurveyItem } from "survey-engine";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getItemColor, getItemTypeInfos } from "@/components/survey-editor/utils/item-type-infos";
import { cn } from "@/lib/utils";

interface ItemTypeIconWithTooltipProps {
    item: SurveyItem;
    iconClassName?: string;
}

const ItemTypeIconWithTooltip = ({ item, iconClassName }: ItemTypeIconWithTooltipProps) => {
    const itemInfos = {
        typeInfos: getItemTypeInfos(item),
        color: getItemColor(item)
    }

    return (
        <Tooltip
            delayDuration={0}
        >
            <TooltipTrigger>
                <div
                    className={itemInfos.typeInfos.defaultItemClassName}
                    style={{
                        color: itemInfos.color
                    }}>
                    <itemInfos.typeInfos.icon
                        className={cn('size-5', iconClassName)}
                    />
                </div>
            </TooltipTrigger>
            <TooltipContent
                align='start'
                side='bottom'
            >
                {itemInfos.typeInfos.label}
            </TooltipContent>
        </Tooltip>
    )
}

export default ItemTypeIconWithTooltip;
