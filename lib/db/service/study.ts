import "server-only";
import { StudyDb, getStudyDb } from "../databases/study-db";
import { Study } from "@/lib/types/study";
import { toStudy } from "./types";

export class StudyService {
    constructor(private readonly db: StudyDb) { }

    async getStudies(limit: number = 50): Promise<Study[]> {
        const docs = await this.db.studyInfos
            .find({}, { projection: { _id: 1, key: 1, status: 1, "props.name": 1, "props.description": 1 } })
            .limit(limit)
            .toArray();
        return docs.map(toStudy);
    }

    async getStudyByKey(key: string): Promise<Study | null> {
        const doc = await this.db.studyInfos.findOne(
            { key },
            { projection: { _id: 1, key: 1, status: 1, "props.name": 1, "props.description": 1 } }
        );
        if (!doc) return null;
        return toStudy(doc);
    }
}

export const studyService = new StudyService(await getStudyDb());
