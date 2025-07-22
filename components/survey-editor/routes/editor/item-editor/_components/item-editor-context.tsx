import { createContext, useContext, useState, ReactNode } from 'react';

interface ItemEditorContextType {
    addItemDialogOpen: boolean;
    setAddItemDialogOpen: (open: boolean) => void;
    openAddItemDialog: () => void;
    closeAddItemDialog: () => void;
}

const ItemEditorContext = createContext<ItemEditorContextType | undefined>(undefined);

interface ItemEditorProviderProps {
    children: ReactNode;
}

export const ItemEditorProvider: React.FC<ItemEditorProviderProps> = ({ children }) => {
    const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

    const openAddItemDialog = () => setAddItemDialogOpen(true);
    const closeAddItemDialog = () => setAddItemDialogOpen(false);

    const value: ItemEditorContextType = {
        addItemDialogOpen,
        setAddItemDialogOpen,
        openAddItemDialog,
        closeAddItemDialog,
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
