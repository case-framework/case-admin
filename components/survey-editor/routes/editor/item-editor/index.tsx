const ItemEditor = () => {
    return <div className="space-y-4">

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className="bg-muted/50 flex-1 rounded-xl h-96" />
        <div className=" flex-1 rounded-xl h-96 bg-red-50/50 border border-red-400" />
    </div>
}

export default ItemEditor;
