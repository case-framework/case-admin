"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

export interface AlertOptions {
    title?: string;
    description?: string;
    buttonLabel?: string;
    children?: ReactNode;
}

export interface AlertApi {
    (options: AlertOptions): Promise<void>;
    dismiss: () => void;
}

interface AlertContextType {
    alert: AlertApi;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

function AlertDialogContent_({
    isOpen,
    title,
    description,
    buttonLabel,
    children,
    onDismiss,
}: {
    isOpen: boolean;
    title: string;
    description: string;
    buttonLabel: string;
    children?: ReactNode;
    onDismiss: () => void;
}) {
    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onDismiss();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
                </AlertDialogHeader>
                {children != null ? <div className="py-2">{children}</div> : null}
                <AlertDialogFooter>
                    <AlertDialogAction
                        className="min-w-24"
                    >{buttonLabel}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
    const [options, setOptions] = useState<AlertOptions>({});
    const [isOpen, setIsOpen] = useState(false);
    const [, setResolver] = useState<(() => void) | null>(null);

    const handleDismiss = useCallback(() => {
        setResolver((prev) => {
            if (prev) prev();
            return null;
        });
        setIsOpen(false);
    }, []);

    const alertFn = useCallback((alertOptions: AlertOptions) => {
        setResolver((prev) => {
            if (prev) prev();
            return null;
        });
        setOptions(alertOptions);
        setIsOpen(true);
        return new Promise<void>((resolve) => {
            setResolver(() => resolve);
        });
    }, []);

    const alert = useMemo(
        () => Object.assign(alertFn, { dismiss: handleDismiss }),
        [alertFn, handleDismiss]
    );

    return (
        <AlertContext.Provider value={{ alert }}>
            {children}
            <AlertDialogContent_
                isOpen={isOpen}
                title={options.title ?? "Notice"}
                description={options.description ?? ""}
                buttonLabel={options.buttonLabel ?? "OK"}
                onDismiss={handleDismiss}
            >
                {options.children}
            </AlertDialogContent_>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertDialogProvider");
    }
    return context.alert;
};
