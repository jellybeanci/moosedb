import { Collection, Document, OptionalId, InsertOneOptions, InsertOneResult, InsertManyResult, BulkWriteOptions } from "mongodb";
declare class MongodbDriver {
    private id;
    private alive;
    private client;
    private database;
    private collection;
    constructor(uri: string);
    initialize(): Promise<void>;
    openDatabase(databaseName: string): MongodbDriver;
    db(databaseName: string): MongodbDriver;
    openConnection(collectionName: string): Collection;
    get(collectionName: string): Collection;
    insertOne(doc: OptionalId<Document>, options?: InsertOneOptions): Promise<InsertOneResult>;
    insertMany(docs: OptionalId<Document>[], options?: BulkWriteOptions): Promise<InsertManyResult>;
    isAlive(): boolean;
    private checkAlive;
    close(): Promise<boolean>;
    private autoClose;
}
export declare function mongoDbDriverFactory(url: string, alive?: boolean): Promise<MongodbDriver>;
export {};
