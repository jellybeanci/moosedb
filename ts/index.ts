import {
  MongoClient,
  Db,
  Collection
} from "mongodb";
import {randomInt} from "@jellybeanci/random";
import {undefCheck} from "undef-check";
import {AsyncDisposable} from "using-statement";
export {using} from "using-statement";

class MongodbDriver implements AsyncDisposable {
  // TODO create documentation

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
    this.id = `id:${randomInt(10_000)}`;
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

  public access(): Collection {
    this.checkAlive();
    return this.collection;
  }

  public col(): Collection {
    return this.access();
  }

  public isAlive(): boolean {
    return this.alive;
  }

  private checkAlive(): void {
    if (!this.isAlive()) throw Error("Connection is not alive. Connection dead or never initialized.");
  }

  private async autoClose(): Promise<boolean> {
    if (!this.isAlive()) return false;
    await this.client.close();
    return !(this.alive = false);
  }

  public async close(): Promise<boolean> {
    return await this.autoClose();
  }

  public dispose(): Promise<void> {
    return Promise.resolve(void this.autoClose());
  }
}

export async function mongoDbDriverFactory(url: string, alive = true): Promise<MongodbDriver> {
  const mongoDriver = new MongodbDriver(url);
  if (alive) await mongoDriver.initialize();
  return mongoDriver;
}