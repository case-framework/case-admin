import { LocalisedObject } from "@/lib/types/localization";

export function getLocalizedText(names: LocalisedObject[], locale: string): string {
	const entry = names.find((n) => n.code === locale) ?? names[0];
	if (!entry) return "";
	return entry.parts
		.map((p) => {
			if (typeof p === "string") return p;
			if (typeof p === "number") return String(p);
			if (p.dtype === "str" && p.str) return p.str;
			if (p.dtype === "num" && p.num !== undefined) return String(p.num);
			return "";
		})
		.join("");
}
