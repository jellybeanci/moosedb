"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbDriverFactory = void 0;
const mongodb_1 = require("mongodb");
const random_1 = require("@jellybeanci/random");
const undef_check_1 = require("undef-check");
class MongodbDriver {
    id;
    alive = false;
    client;
    database;
    collection;
    constructor(uri) {
        (0, undef_check_1.undefCheck)(uri, "URI cannot be passed Empty or Undefined.");
        this.client = new mongodb_1.MongoClient(uri);
    }
    async initialize() {
        if (this.alive)
            return;
        await this.client.connect();
        this.alive = true;
        this.id = `id:${(0, random_1.randomInt)(10_000)}`;
    }
    openDatabase(databaseName) {
        (0, undef_check_1.undefCheck)(databaseName, "Database Name cannot be passed Empty or Undefined.");
        this.checkAlive();
        this.database = this.client.db(databaseName);
        return this;
    }
    db(databaseName) {
        return this.openDatabase(databaseName);
    }
    openConnection(collectionName) {
        (0, undef_check_1.undefCheck)(collectionName, "Collection Name cannot be passed Empty or Undefined.");
        this.checkAlive();
        this.collection = this.database.collection(collectionName);
        return this.collection;
    }
    get(collectionName) {
        return this.openConnection(collectionName);
    }
    access() {
        this.checkAlive();
        return this.collection;
    }
    col() {
        return this.access();
    }
    isAlive() {
        return this.alive;
    }
    checkAlive() {
        if (!this.isAlive())
            throw Error("Connection is not alive. Connection dead or never initialized.");
    }
    async close() {
        return await this.autoClose();
    }
    async autoClose() {
        if (!this.isAlive())
            return false;
        await this.client.close();
        return !(this.alive = false);
    }
    dispose() {
        return Promise.resolve(void this.autoClose());
    }
}
async function mongoDbDriverFactory(url, alive = true) {
    const mongoDriver = new MongodbDriver(url);
    if (alive)
        await mongoDriver.initialize();
    return mongoDriver;
}
exports.mongoDbDriverFactory = mongoDbDriverFactory;
