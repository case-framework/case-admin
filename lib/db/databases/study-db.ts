import "server-only";
import { getDb } from "../db-registry";
import { DbKey } from "../utils";
import { AppDb, CollectionIndexDef, RecommendedIndex } from "./base";
import { StudyDoc } from "../service/types";

// Recommended indexes keyed by per-study collection suffix.
// Each study gets a set of collections named `{studyKey}_{suffix}`.
const DYNAMIC_INDEX_TEMPLATES: Record<string, RecommendedIndex[]> = {
    surveys: [
        { name: "surveyDefinition.key_1_unpublished_1_published_-1", keys: { "surveyDefinition.key": 1, unpublished: 1, published: -1 } },
        { name: "published_1_surveyDefinition.key_1", keys: { published: 1, "surveyDefinition.key": 1 } },
        { name: "unpublished_1", keys: { unpublished: 1 } },
        { name: "surveyDefinition.key_1_versionID_1", keys: { "surveyDefinition.key": 1, versionID: 1 }, unique: true },
    ],
    surveyResponses: [
        { name: "participantID_1", keys: { participantID: 1 } },
        { name: "participantID_1_key_1_submittedAt_1", keys: { participantID: 1, key: 1, submittedAt: 1 } },
        { name: "submittedAt_1", keys: { submittedAt: 1 } },
        { name: "arrivedAt_1", keys: { arrivedAt: 1 } },
        { name: "key_1", keys: { key: 1 } },
    ],
    participants: [
        { name: "participantID_1", keys: { participantID: 1 }, unique: true },
        { name: "studyStatus_1", keys: { studyStatus: 1 } },
        { name: "enteredAt_1", keys: { enteredAt: 1 } },
        { name: "messages.scheduledFor_1_studyStatus_1", keys: { "messages.scheduledFor": 1, studyStatus: 1 } },
        { name: "messages.scheduledFor_1", keys: { "messages.scheduledFor": 1 } },
    ],
    confidentialResponses: [
        { name: "participantID_1_key_1", keys: { participantID: 1, key: 1 } },
    ],
    reports: [
        { name: "participantID_1", keys: { participantID: 1 } },
        { name: "timestamp_1", keys: { timestamp: 1 } },
        { name: "participantID_1_key_1_timestamp_1", keys: { participantID: 1, key: 1, timestamp: 1 } },
    ],
    participantFiles: [
        { name: "participantID_1_createdAt_-1", keys: { participantID: 1, createdAt: -1 } },
        { name: "createdAt_-1", keys: { createdAt: -1 } },
    ],
};

// Known per-study suffixes without recommended indexes (but recognized as valid collections)
const KNOWN_DYNAMIC_SUFFIXES_NO_INDEXES = new Set(["researcherMessages"]);

const ALL_DYNAMIC_SUFFIXES = new Set([
    ...Object.keys(DYNAMIC_INDEX_TEMPLATES),
    ...KNOWN_DYNAMIC_SUFFIXES_NO_INDEXES,
]);

export class StudyDb extends AppDb {
    readonly key = DbKey.STUDY;

    // Static collections
    readonly studyInfos = this.db.collection<StudyDoc>("study-infos");
    readonly studyRules = this.db.collection("studyRules");
    readonly taskQueue = this.db.collection("taskQueue");
    readonly studyCodeLists = this.db.collection("studyCodeLists");
    readonly studyCounters = this.db.collection("studyCounters");
    readonly studyVariables = this.db.collection("studyVariables");
    readonly confidentialIdMap = this.db.collection("confidential-id-map");

    // Dynamic per-study collection accessors
    participants(studyKey: string) { return this.db.collection(`${studyKey}_participants`); }
    surveys(studyKey: string) { return this.db.collection(`${studyKey}_surveys`); }
    surveyResponses(studyKey: string) { return this.db.collection(`${studyKey}_surveyResponses`); }
    confidentialResponses(studyKey: string) { return this.db.collection(`${studyKey}_confidentialResponses`); }
    reports(studyKey: string) { return this.db.collection(`${studyKey}_reports`); }
    participantFiles(studyKey: string) { return this.db.collection(`${studyKey}_participantFiles`); }
    researcherMessages(studyKey: string) { return this.db.collection(`${studyKey}_researcherMessages`); }

    private readonly staticIndexDefs: CollectionIndexDef[] = [
        {
            collection: this.studyInfos,
            indexes: [
                { name: "key_1", keys: { key: 1 }, unique: true },
            ],
        },
        {
            collection: this.studyRules,
            indexes: [
                { name: "studyKey_1", keys: { studyKey: 1 } },
                { name: "uploadedAt_1_studyKey_1", keys: { uploadedAt: 1, studyKey: 1 } },
            ],
        },
        {
            collection: this.taskQueue,
            indexes: [
                { name: "updatedAt_1", keys: { updatedAt: 1 }, expireAfterSeconds: 172800 },
            ],
        },
        {
            collection: this.studyCodeLists,
            indexes: [
                { name: "studyKey_1_listKey_1_code_1", keys: { studyKey: 1, listKey: 1, code: 1 }, unique: true },
            ],
        },
        {
            collection: this.studyCounters,
            indexes: [
                { name: "studyKey_1_scope_1", keys: { studyKey: 1, scope: 1 }, unique: true },
            ],
        },
        {
            collection: this.studyVariables,
            indexes: [
                { name: "studyKey_1_key_1", keys: { studyKey: 1, key: 1 }, unique: true },
            ],
        },
        {
            collection: this.confidentialIdMap,
            indexes: [
                { name: "confidentialID_1_studyKey_1", keys: { confidentialID: 1, studyKey: 1 }, unique: true },
            ],
        },
    ];

    async getIndexDefs(): Promise<CollectionIndexDef[]> {
        const staticNames = new Set(this.staticIndexDefs.map((d) => d.collection.collectionName));

        const allCollectionNames = await this.db
            .listCollections({}, { nameOnly: true })
            .toArray()
            .then((cs) => cs.map((c) => c.name));

        const dynamicDefs: CollectionIndexDef[] = [];
        for (const name of allCollectionNames) {
            if (staticNames.has(name)) continue;
            const suffix = Array.from(ALL_DYNAMIC_SUFFIXES).find((s) => name.endsWith(`_${s}`));
            if (!suffix) continue;
            dynamicDefs.push({
                collection: this.db.collection(name),
                indexes: DYNAMIC_INDEX_TEMPLATES[suffix] ?? [],
            });
        }

        dynamicDefs.sort((a, b) => a.collection.collectionName.localeCompare(b.collection.collectionName));

        return [...this.staticIndexDefs, ...dynamicDefs];
    }
}

let _db: Promise<StudyDb> | undefined;
export const getStudyDb = (): Promise<StudyDb> =>
    (_db ??= getDb(DbKey.STUDY).then((db) => new StudyDb(db)));
