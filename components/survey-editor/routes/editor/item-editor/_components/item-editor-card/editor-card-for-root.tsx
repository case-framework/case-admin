import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ItemEditorCard, { CommonItemEditorCardProps } from "./_components/item-editor-card";
import { TabsContent } from "@/components/ui/tabs";
import { List } from "lucide-react";
import GroupItems from "./_components/group-items";

const editorModes = [
    {
        id: "items",
        label: "Items",
        icon: List,
    }
]



const EditorCardForRoot: React.FC<CommonItemEditorCardProps> = (props) => {
    return <ItemEditorCard
        surveyItem={props.item}
        menu={{
            hideColorSelector: false,
            hideDeleteItem: true,
            items: [
                <DropdownMenuItem key="todo-item">
                    Todo
                </DropdownMenuItem>
            ]
        }}
        navItems={editorModes}
    >
        <TabsContent value="items"
            className="flex flex-col h-full min-h-0"
        >
            <GroupItems />
        </TabsContent>
        <TabsContent value="preview" className="space-y-4 h-full min-h-0 overflow-y-auto">
            todo: preview tab
        </TabsContent>
        <TabsContent value="conditions" className="space-y-4 h-full min-h-0 overflow-y-auto">
            todo: conditions tab
        </TabsContent>
    </ItemEditorCard>
}

export default EditorCardForRoot;
