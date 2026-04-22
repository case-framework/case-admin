import "server-only";
import { getDb } from "../db-registry";
import { DbKey } from "../utils";
import { AppDb, CollectionIndexDef } from "./base";

export class MessageDb extends AppDb {
    readonly key = DbKey.MESSAGE;

    readonly emailTemplates = this.db.collection("email-templates");
    readonly smsTemplates = this.db.collection("sms-templates");
    readonly sentEmails = this.db.collection("sent-emails");
    readonly sentSms = this.db.collection("sent-sms");

    readonly indexDefs: CollectionIndexDef[] = [
        {
            collection: this.emailTemplates,
            indexes: [
                { name: "messageType_1_studyKey_1", keys: { messageType: 1, studyKey: 1 }, unique: true },
            ],
        },
        {
            collection: this.smsTemplates,
            indexes: [
                { name: "messageType_1", keys: { messageType: 1 }, unique: true },
            ],
        },
        {
            collection: this.sentEmails,
            indexes: [
                { name: "userId_1_sentAt_1", keys: { userId: 1, sentAt: 1 } },
            ],
        },
        {
            collection: this.sentSms,
            indexes: [
                { name: "userID_1_sentAt_1_messageType_1", keys: { userID: 1, sentAt: 1, messageType: 1 } },
            ],
        },
    ];

    async getIndexDefs(): Promise<CollectionIndexDef[]> {
        return this.indexDefs;
    }
}

let _db: Promise<MessageDb> | undefined;
export const getMessageDb = (): Promise<MessageDb> =>
    (_db ??= getDb(DbKey.MESSAGE).then((db) => new MessageDb(db)));
