import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"


interface ConfirmDialogProps {
    title: string;
    description: string;
    confirmButtonText: string;
    cancelButtonText: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant: "default" | "destructive";
    isOpen: boolean;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    return (
        <AlertDialog
            open={props.isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    props.onCancel();
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{props.title}</AlertDialogTitle>
                    <AlertDialogDescription>{props.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={(e) => {
                            e.preventDefault();
                            props.onCancel();
                        }}
                    >
                        {props.cancelButtonText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant={props.variant}
                        onClick={(e) => {
                            e.preventDefault();
                            props.onConfirm();
                        }}
                    >
                        {props.confirmButtonText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmDialog;