import { createContext, useContext } from "react";

interface ItemEditorContextValue {
    selectedItemKey: string | null;
    setSelectedItemKey: (key: string | null) => void;
    currentPath: string | null;
    setCurrentPath: (path: string | null) => void;
}

export const ItemEditorContext = createContext<ItemEditorContextValue>({
    selectedItemKey: null,
    setSelectedItemKey: () => { },
    currentPath: null,
    setCurrentPath: () => { },
});


interface ItemEditorContextProviderProps extends ItemEditorContextValue {
    children?: React.ReactNode;
}

export const ItemEditorContextProvider: React.FC<ItemEditorContextProviderProps> = ({ children, ...props }) => {
    const contextValue = {
        ...props,
    };

    return <ItemEditorContext.Provider value={contextValue}>
        {children}
    </ItemEditorContext.Provider>
}

export const useItemEditorCtx = () => {
    const context = useContext(ItemEditorContext);
    if (!context) {
        throw new Error('useItemEditorCtx must be used within ItemEditorContextProvider');
    }
    return context;
};
