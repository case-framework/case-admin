import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GroupItem } from "survey-engine";
import ItemPreview from "./item-preview";
import { AddItemDialog } from "../../add-item-dialog";
import { Plus } from "lucide-react";


const GroupItems = () => {
    const { editor } = useSurveyEditor();
    let { selectedItemKey } = useItemNavigation();
    const { navigateToItem } = useItemNavigation();

    const [itemKeyForPreview, setItemKeyForPreview] = useState<string | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);

    if (!selectedItemKey) {
        selectedItemKey = editor?.survey.surveyKey;
    }

    const surveyItem = editor?.survey.surveyItems[selectedItemKey as string];
    if (!surveyItem) {
        throw new Error("No survey item");
    }

    const groupItem = surveyItem as GroupItem;
    const surveyItems = editor?.survey.rootItem.items || [];
    const isEmpty = surveyItems.length === 0;

    return <div className="flex grow ">
        <div className="flex-1 pt-2 px-4 pb-4 border-r border-border">
            {/* Header with title and plus button */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Survey Items</h3>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Item
                </Button>
            </div>

            {/* Empty state with center button */}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-muted-foreground mb-4">
                        <p className="text-lg font-medium">No survey items yet</p>
                        <p className="text-sm">Add your first survey item to get started</p>
                    </div>
                    <Button
                        onClick={() => setShowAddDialog(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Item
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Survey items list */}
                    {surveyItems.map((item) => (
                        <button 
                            key={item}
                            className="w-full text-left p-3 rounded-md border hover:bg-muted/50 transition-colors"
                            onClick={() => setItemKeyForPreview(item)}
                            onDoubleClick={() => navigateToItem(item)}
                        >
                            <div className="font-medium">{item}</div>
                            <div className="text-sm text-muted-foreground">
                                {editor?.survey.surveyItems[item]?.itemType || 'Unknown type'}
                            </div>
                        </button>
                    ))}
                    
                    {/* Add button at end of list */}
                    <Button
                        variant="outline"
                        onClick={() => setShowAddDialog(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 mt-4 border-dashed"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </Button>
                </div>
            )}
        </div>

        <div className="flex-1 pt-2 px-4 pb-4">
            <ItemPreview item={editor?.survey.surveyItems[itemKeyForPreview as string]} />
        </div>
        
        <AddItemDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            parentKey={selectedItemKey}
        />
    </div>
}

export default GroupItems;
