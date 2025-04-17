import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabbedItemEditorProps {
    isActive: boolean;
    title: string;
    contentEditor: React.ReactNode | undefined;
    conditionsEditor: React.ReactNode | undefined;
}

const triggerClassName = "text-sm data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:border data-[state=active]:border-slate-200 data-[state=active]:text-accent-foreground data-[state=active]:[box-shadow:none]";

export const TabbedItemEditor: React.FC<TabbedItemEditorProps> = (props) => {
    return props.isActive ? (<div>
        <Separator className='bg-border mt-2' />
        <Tabs defaultValue="content" className="mt-2">
            <div className="flex flex-row justify-between items-center">
                <p className='font-semibold'>{props.title}</p>
                <TabsList className="bg-muted p-0.5 rounded-md border border-neutral-200 gap-1">
                    <TabsTrigger className={triggerClassName} value="content">Content</TabsTrigger>
                    <TabsTrigger className={triggerClassName} value="conditions">Conditions</TabsTrigger>
                    {/* Use Badge here to indicate if there are any conditions */}
                </TabsList>
            </div>
            <TabsContent value="content">
                {props.contentEditor ?? <></>}
            </TabsContent>
            <TabsContent value="conditions">
                {props.conditionsEditor ?? <></>}
            </TabsContent>
        </Tabs>
    </div>
    ) : <div className="flex flex-col gap-2">
        <p className='text-sm text-muted-foreground'>No item selected.</p>
    </div>
}