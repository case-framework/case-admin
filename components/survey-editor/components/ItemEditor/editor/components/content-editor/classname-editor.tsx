import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const ClassNameEditor = (props: {
    styles: { key: string, value: string }[],
    styleKey: string,
    label: string,
    onChange: (key: string, value: string | undefined) => void
}) => {
    return <div className="flex items-center gap-2 w-full" data-no-dnd="true">
        <Label htmlFor={'input-' + props.styleKey} className="text-xs w-1/3">
            {props.label}
        </Label>
        <Input
            id={'input-' + props.styleKey}
            className="w-2/3"
            value={props.styles?.find(st => st.key === props.styleKey)?.value ?? ""}
            onChange={(e) => { props.onChange(props.styleKey, e.target.value) }}
        />
    </div>
}