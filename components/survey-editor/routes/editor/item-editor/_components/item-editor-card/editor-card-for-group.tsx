import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import ItemEditorCard, { CommonItemEditorCardProps } from "./_components/item-editor-card";
import { Edit3, Eye, Filter } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

const editorModes = [
    {
        id: "structure",
        label: "Structure",
        icon: Edit3,
        hasIndicator: false,
    },
    {
        id: "preview",
        label: "Preview",
        icon: Eye,
        hasIndicator: false,
    },
    {
        id: "conditions",
        label: "Conditions",
        icon: Filter,
        hasIndicator: true,
        indicatorCount: 3,
    }
]


const EditorCardForGroup: React.FC<CommonItemEditorCardProps> = (props) => {
    return <ItemEditorCard
        surveyItem={props.item}
        menu={{
            hideColorSelector: true,
            items: [
                <DropdownMenuItem key="todo-item">
                    Todo
                </DropdownMenuItem>
            ]
        }}
        navItems={editorModes}
    >
        <TabsContent value="structure" className="space-y-4">
            todo: structure tab
        </TabsContent>
    </ItemEditorCard>
}

export default EditorCardForGroup;
