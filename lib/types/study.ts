import { LocalisedObject } from "./localization";

export interface Study {
    id: string;
    key: string;
    status: string;
    name: LocalisedObject[];
    description: LocalisedObject[];
}
