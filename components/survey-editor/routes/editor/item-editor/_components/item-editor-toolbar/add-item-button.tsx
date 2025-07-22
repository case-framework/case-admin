import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddItemDialog } from "../item-editor-context";

interface AddItemButtonProps {
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
    className?: string;
    children?: React.ReactNode;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({
    variant = "outline",
    size = "default",
    className = "",
    children
}) => {
    const { openAddItemDialog } = useAddItemDialog();

    return (
        <Button
            variant={variant}
            size={size}
            onClick={openAddItemDialog}
            className={`flex items-center gap-2 ${className}`}
        >
            <Plus className="size-4" />
            {children || "Add Item"}
        </Button>
    );
};

export default AddItemButton;
