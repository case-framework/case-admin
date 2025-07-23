import { createContext, useContext, useState, ReactNode } from 'react';

interface ItemEditorContextType {
    addItemDialogOpen: boolean;
    setAddItemDialogOpen: (open: boolean) => void;
    openAddItemDialog: (targetParentKey?: string) => void;
    closeAddItemDialog: () => void;
    targetParentKey: string | undefined;
}

const ItemEditorContext = createContext<ItemEditorContextType | undefined>(undefined);

interface ItemEditorProviderProps {
    children: ReactNode;
}

export const ItemEditorProvider: React.FC<ItemEditorProviderProps> = ({ children }) => {
    const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
    const [targetParentKey, setTargetParentKey] = useState<string | undefined>(undefined);

    const openAddItemDialog = (targetParentKey?: string) => {
        setTargetParentKey(targetParentKey);
        setAddItemDialogOpen(true);
    };
    const closeAddItemDialog = () => setAddItemDialogOpen(false);

    const value: ItemEditorContextType = {
        addItemDialogOpen,
        setAddItemDialogOpen,
        openAddItemDialog,
        closeAddItemDialog,
        targetParentKey,
    };

    return (
        <ItemEditorContext.Provider value={value}>
            {children}
        </ItemEditorContext.Provider>
    );
};

export const useItemEditor = (): ItemEditorContextType => {
    const context = useContext(ItemEditorContext);
    if (context === undefined) {
        throw new Error('useItemEditor must be used within an ItemEditorProvider');
    }
    return context;
};

// Custom hook for triggering add item dialog from anywhere in the tree
export const useAddItemDialog = () => {
    const { openAddItemDialog, closeAddItemDialog } = useItemEditor();
    return { openAddItemDialog, closeAddItemDialog };
};
