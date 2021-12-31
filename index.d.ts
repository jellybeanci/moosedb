import { Collection } from "mongodb";
import { AsyncDisposable } from "using-statement";
declare class MongodbDriver implements AsyncDisposable {
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
    access(): Collection;
    col(): Collection;
    isAlive(): boolean;
    private checkAlive;
    private autoClose;
    close(): Promise<boolean>;
    dispose(): Promise<void>;
}
export declare function mongoDbDriverFactory(url: string, alive?: boolean): Promise<MongodbDriver>;
export {};
