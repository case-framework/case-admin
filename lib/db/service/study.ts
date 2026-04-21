import "server-only";
import { Collection, Db } from "mongodb";
import { getDb } from "../db-registry";
import { DbKey } from "../utils";
import { Study } from "@/lib/types/study";
import { StudyDoc, toStudy } from "./types";

export class StudyService {
    private readonly collection: Collection<StudyDoc>;

    constructor(db: Db) {
        this.collection = db.collection<StudyDoc>("study-infos");
    }

    async getStudies(limit: number = 50): Promise<Study[]> {
        const docs = await this.collection
            .find({}, { projection: { _id: 1, key: 1, status: 1, "props.name": 1, "props.description": 1 } })
            .limit(limit)
            .toArray();
        return docs.map(toStudy);
    }

    async getStudyByKey(key: string): Promise<Study | null> {
        const doc = await this.collection.findOne(
            { key },
            { projection: { _id: 1, key: 1, status: 1, "props.name": 1, "props.description": 1 } }
        );
        if (!doc) return null;
        return toStudy(doc);
    }
}

const initStudyService = async () => {
    const db = await getDb(DbKey.STUDY);
    return new StudyService(db);
};

export const studyService = await initStudyService();
