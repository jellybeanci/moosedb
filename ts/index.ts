/**
 * Date: 02/01/2022
 * @author {@link https://www.github.com/GokselKUCUKSAHIN | Göksel KÜÇÜKŞAHİN} <gokselkucuksahin@gmail.com>
 */
import {
  MongoClient,
  Db,
  Collection
} from "mongodb";
import {AsyncDisposable} from "using-statement";
import {undefCheck} from "undef-check";
import {randomInt} from "@jellybeanci/random";
import {EventEmitter} from "events";

export {using} from "using-statement";
/***
 * <h2>Events</h2>
 * <ul>
 *   <li>beforeCreate</li>
 *   <li>created</li>
 *   <li>beforeInitialized</li>
 *   <li>initialized</li>
 *   <li>beforeClose</li>
 *   <li>closed</li>
 *   <li>disposed</li>
 * </ul>
 */

class MongodbDriver extends EventEmitter implements AsyncDisposable {
  // TODO create documentation

  private id: string;
  private alive: boolean = false;
  private client: MongoClient;
  private database: Db;
  private collection: Collection;

  constructor(uri: string) {
    super();
    this.emit("beforeCreate");
    undefCheck(uri, "URI cannot be passed Empty or Undefined.");
    this.client = new MongoClient(uri);
    this.emit("created");
  }

  public async initialize(): Promise<void> {
    if (this.alive) return;
    this.emit("beforeInitialized");
    await this.client.connect();
    this.alive = true;
    this.id = `id:${randomInt(10_000)}`;
    this.emit("initialized");
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
    this.emit("beforeClose");
    if (!this.isAlive()) return false;
    await this.client.close();
    this.emit("closed");
    return !(this.alive = false);
  }

  public async close(): Promise<boolean> {
    return await this.autoClose();
  }

  public dispose(): Promise<void> {
    this.emit("disposed");
    return Promise.resolve(void this.autoClose());
  }
}

export async function mongoDbDriverFactory(url: string, alive = true): Promise<MongodbDriver> {
  const mongoDriver = new MongodbDriver(url);
  if (alive) await mongoDriver.initialize();
  return mongoDriver;
}