"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbDriverFactory = void 0;
const mongodb_1 = require("mongodb");
const undef_check_1 = require("undef-check");
const int_1 = require("@jellybeanci/int");
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
        this.id = `id:${(0, int_1.int)(Math.random() * 10_000)}`;
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
    async insertOne(doc, options) {
        this.checkAlive();
        (0, undef_check_1.undefCheck)(doc, "Object undefined.");
        if (Array.isArray(doc))
            throw Error("Can't use Arrays on insertOne method.");
        return await this.collection.insertOne(doc, options);
    }
    async insertMany(docs, options) {
        this.checkAlive();
        (0, undef_check_1.undefCheck)(docs, "Object Array undefined.");
        if (!Array.isArray(docs))
            throw Error("bodyArray must be an Object Array.");
        return await this.collection.insertMany(docs, options);
    }
    isAlive() {
        return this.alive;
    }
    checkAlive() {
        if (!this.isAlive())
            throw Error("Connection is not alive. Connection dead or never initialized.");
    }
    async close() {
        console.log("Exit called", this.id);
        return await this.autoClose();
    }
    async autoClose() {
        console.log("ID=", this.id);
        if (!this.isAlive())
            return false;
        await this.client.close();
        return !(this.alive = false);
    }
}
async function mongoDbDriverFactory(url, alive = true) {
    const mongoDriver = new MongodbDriver(url);
    if (alive)
        await mongoDriver.initialize();
    return mongoDriver;
}
exports.mongoDbDriverFactory = mongoDbDriverFactory;
