import {
  MongoClient,
  Db,
  Collection,
  Document,
  OptionalId,
  InsertOneOptions,
  InsertOneResult,
  InsertManyResult,
  BulkWriteOptions
} from "mongodb";
import {undefCheck} from "undef-check";
import {int} from "@jellybeanci/int";

class MongodbDriver {
  private id: string;
  private alive: boolean = false;
  private client: MongoClient;
  private database: Db;
  private collection: Collection;

  constructor(uri: string) {
    undefCheck(uri, "URI cannot be passed Empty or Undefined.");
    this.client = new MongoClient(uri);
  }

  public async initialize(): Promise<void> {
    if (this.alive) return;
    await this.client.connect();
    this.alive = true;
    this.id = `id:${int(Math.random() * 10_000)}`;
  }

  public openDatabase(databaseName: string): MongodbDriver {
    undefCheck(databaseName, "Database Name cannot be passed Empty or Undefined.");
    this.checkAlive();
    this.database = this.client.db(databaseName);
    return this;
  }

  public db(databaseName: string): MongodbDriver {
    return this.openDatabase(databaseName);
  }

  public openConnection(collectionName: string): Collection {
    undefCheck(collectionName, "Collection Name cannot be passed Empty or Undefined.");
    this.checkAlive();
    this.collection = this.database.collection(collectionName);
    return this.collection;
  }

  public get(collectionName: string): Collection {
    return this.openConnection(collectionName);
  }

  public async insertOne(doc: OptionalId<Document>, options?: InsertOneOptions): Promise<InsertOneResult> {
    this.checkAlive();
    undefCheck(doc, "Object undefined.");
    if (Array.isArray(doc)) throw Error("Can't use Arrays on insertOne method.");
    return await this.collection.insertOne(doc, options);
  }

  public async insertMany(docs: OptionalId<Document>[], options?: BulkWriteOptions): Promise<InsertManyResult> {
    this.checkAlive();
    undefCheck(docs, "Object Array undefined.");
    if (!Array.isArray(docs)) throw Error("bodyArray must be an Object Array.");
    return await this.collection.insertMany(docs, options);
  }

  public isAlive() {
    return this.alive;
  }

  private checkAlive() {
    if (!this.isAlive()) throw Error("Connection is not alive. Connection dead or never initialized.");
  }

  public async close(): Promise<boolean> {
    console.log("Exit called", this.id);
    return await this.autoClose();
  }

  private async autoClose(): Promise<boolean> {
    console.log("ID=", this.id);
    if (!this.isAlive()) return false;
    await this.client.close();
    return !(this.alive = false);
  }
}

export async function mongoDbDriverFactory(url: string, alive = true) {
  const mongoDriver = new MongodbDriver(url);
  if (alive) await mongoDriver.initialize();
  return mongoDriver;
}

