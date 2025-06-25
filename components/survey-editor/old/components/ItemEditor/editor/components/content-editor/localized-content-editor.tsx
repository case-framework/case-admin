import { useSurveyEditorCtx } from "@/components/survey-editor/surveyEditorContext";
import { ItemComponent, LocalizedContentType } from "survey-engine/data_types";
import { ClassNameEditor } from "./classname-editor";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDownIcon, InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DynamicValuesEditor from "./dynamic-values-editor";

interface LocalizedContentEditorProps {
    component: ItemComponent;
    contentKey: string;
    onChange: (newComp: ItemComponent) => void;
    label?: string;
    defaultType?: LocalizedContentType;
    placeholder?: string;
    useTextArea?: boolean;
}

const LocalizedContentEditor: React.FC<LocalizedContentEditorProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const contentList = props.component.content ? props.component.content : [];

    const currentContent = contentList.find(c => c.key === props.contentKey);

    if (!currentContent) {
        props.onChange({
            ...props.component,
            content: [
                ...contentList,
                {
                    key: props.contentKey,
                    type: props.defaultType || 'plain',
                }
            ]
        });
        return <div>Initializing content...</div>
    }

    const currentTranslation = props.component.translations?.[selectedLanguage]?.[props.contentKey] || '';

    const onChangeTranslation = (value: string) => {
        const currentTranslations = props.component.translations || {};
        if (!currentTranslations[selectedLanguage]) {
            currentTranslations[selectedLanguage] = {};
        }

        currentTranslations[selectedLanguage][props.contentKey] = value;

        const updatedContent = {
            ...currentContent,
            translations: currentTranslations
        }

        props.onChange({
            ...props.component,
            translations: currentTranslations
        });
    }

    const renderContentEditor = () => {
        switch (currentContent.type) {
            case 'plain':
                return <p>simple text editor</p>
            case 'CQM':
                return <div className="">
                    {props.useTextArea ? (
                        <Textarea
                            id={`${props.contentKey}-editor`}
                            className="font-mono"
                            placeholder={props.placeholder}
                            value={currentTranslation}
                            onChange={(e) => onChangeTranslation(e.target.value)}
                        />
                    ) : (
                        <Input
                            id={`${props.contentKey}-editor`}
                            placeholder={props.placeholder}
                            value={currentTranslation}
                            onChange={(e) => onChangeTranslation(e.target.value)}
                        />
                    )}

                    <Tooltip
                        delayDuration={0}
                    >
                        <TooltipTrigger className="ml-auto text-xs text-muted-foreground flex items-center gap-1 py-1">
                            <InfoIcon className="size-3 text-gray-400" />
                            Syntax
                        </TooltipTrigger>
                        <TooltipContent align="end">
                            <div className="gap-2 flex flex-col text-xs">
                                <span className="font-bold">Syntax tips:</span>
                                <div className="ps-2 flex flex-col gap-1">
                                    <code className=" px-1 mr-1">**bold**</code>
                                    <code className=" px-1 mr-1">__underline__</code>
                                    <code className=" px-1 mr-1">!!primary!!</code>
                                    <code className=" px-1 mr-1">~~accent~~</code>
                                    <code className="px-1 mr-1">//italic//</code>
                                    <code className=" px-1">{"{{expression}}"}</code>
                                </div>

                            </div>
                        </TooltipContent>
                    </Tooltip>

                </div>
            case 'md':
                return <p>markdown editor</p>
        }
    }

    let classNameEditorLabel = 'CSS classes';
    switch (currentContent.type) {
        case 'CQM':
        case 'md':
            classNameEditorLabel = 'Wrapper CSS classes';
            break;
    }

    return <div className="space-y-2 mt-4">
        <Label htmlFor={`${props.contentKey}-editor`}>
            <div className="flex items-center gap-2 justify-between">
                <span>
                    {props.label}
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'outline'} className="px-2 py-1 h-auto">
                            <span className="text-xs font-mono font-semibold">
                                {currentContent.type}
                            </span>
                            <ChevronDownIcon className="size-4 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Content type
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={currentContent.type === 'plain'}
                                onCheckedChange={() => {
                                    props.onChange({ ...props.component, content: [{ ...currentContent, type: 'plain' }] });
                                }}
                            >
                                Plain text
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={currentContent.type === 'CQM'}
                                onCheckedChange={() => {
                                    props.onChange({ ...props.component, content: [{ ...currentContent, type: 'CQM' }] });
                                }}
                            >
                                CASE Quick Markup
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={currentContent.type === 'md'}
                                onCheckedChange={() => {
                                    props.onChange({ ...props.component, content: [{ ...currentContent, type: 'md' }] });
                                }}
                            >
                                Markdown
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Label>
        {renderContentEditor()}

        {/* Dynamic Values Editor - only show for CQM content type */}
        {currentContent.type === 'CQM' && (
            <DynamicValuesEditor
                component={props.component}
                onChange={props.onChange}
            />
        )}

        <ClassNameEditor
            styles={props.component.style || []}
            styleKey='className'
            label={classNameEditorLabel}
            onChange={(key, value) => {
                if (value) {
                    props.onChange({ ...props.component, style: [{ key, value }] });
                } else {
                    props.onChange({ ...props.component, style: props.component.style?.filter(s => s.key !== key) });
                }
            }}
        />
    </div>;
}

export default LocalizedContentEditor;
