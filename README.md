# Moosedb the mongoDbDriverFactory

## Package Overview

`mongoDbDriverFactory` is a Node.js package built with TypeScript that facilitates easy connection, management, and termination of MongoDB database connections. This package provides essential functionality for interacting with MongoDB, including creating connections, accessing databases and collections, and closing the connection.

It is designed to interact efficiently with MongoDB by leveraging asynchronous operations and an event-driven architecture, making it a great choice for developers who need a streamlined MongoDB experience.

## Installation

To add this package to your project, you can install it via npm with the following command:

```bash
npm install moosedb
```

If you are using yarn, you can install it with:

```bash
yarn add moosedb
```

## Usage

### Basic Setup

Before using the package, create an instance of the `mongoDbDriverFactory` class. You’ll need to establish a connection by providing the MongoDB URI. Once connected, you can open a database and perform operations on collections.

Here’s an example:

```ts
import {mongoDbDriverFactory} from "../index";

// Create a new MongoDB driver instance
const mongoDriver = await mongoDbDriverFactory.create("mongodb://localhost:27017", true);

// Open a database and collection
mongoDriver.openDatabase("my_database").openConnection("my_collection");
```

### Example Methods

The `mongoDbDriverFactory` class provides various methods to interact with MongoDB. Below are examples of common use cases:

#### insertOneTest()

This function demonstrates inserting a single document into a collection:

```ts
static async insertOneTest(): Promise<void> {
    using(await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017"), async driver => {
        driver.db("test").get("new-table");
        const response = await driver.col().insertOne({my: 3, file: 4});
        console.log("response:", response);
    });
}
```

#### insertManyTest()

This function shows how to insert multiple documents at once:

```ts
static async insertManyTest(): Promise<void> {
    const driver = await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017");
    driver.db("test").get("new-table");
    const response = await driver.col().insertMany([{multiple: 5, doc: 6}, {insert: 7, test: 8}]);
    console.log("response:", response);
    console.log("close response:", await driver.close());
}
```

#### findTest()

This method demonstrates querying a collection and printing all the documents found:

```ts
static async findTest(): Promise<void> {
    using(await mongoDbDriverFactory("mongodb://super:password@10.1.8.88:27017"), async driver => {
        driver.db("test").get("new-table");
        const cursor = driver.col().find();
        await cursor.forEach(console.log);
    })
}
```

#### insertyDataset()

This example shows how to read data from JSON files and insert the combined data into a collection:

```ts  
static async insertyDataset(): Promise<void> {
    const data1Str = readFileSync("../../data/data1.json", "utf-8");
    const data2Str = readFileSync("../../data/data2.json", "utf-8");
    const data1 = JSON.parse(data1Str);
    const data2 = JSON.parse(data2Str);
    const data = [...data1, ...data2];
    console.log(data);
    using(await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017"), async driver => {
        const collection = driver.db("results").get("statistics");
        const response = await collection.insertMany(data);
        console.log("operation complete\n", response);
    });
}
```

#### sortAndLimit()

This function demonstrates sorting and limiting the number of results from a query:

```ts
static async sortAndLimit(): Promise<void> {
    using(await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017"), async driver => {
        const collection = driver.db("results").get("statistics");
        const top10 = await collection.find().sort({currency: -1}).limit(10).toArray();
        console.log(top10);
    });
}
```

## Events

The `mongoDbDriverFactory` class emits several events that you can subscribe to, allowing you to respond to different stages of the connection lifecycle. Below are the events supported:

- `beforeCreate`: Triggered before the object is created.
- `created`: Triggered after the object is created.
- `beforeInitialized`: Triggered before the connection is initialized.
- `initialized`: Triggered after the connection is initialized.
- `beforeClose`: Triggered before the connection is closed.
- `closed`: Triggered after the connection is closed.
- `disposed`: Triggered when the object is disposed.

Example:

```ts
mongoDriver.on("beforeCreate", () => {
  console.log("Before create event");
});

mongoDriver.on("created", () => {
  console.log("Created event");
});
```

## Notes

- This package simplifies MongoDB connection management and allows for more fine-grained control with its event-driven structure.
- Ensure you call the `initialize()` method before using the connection.
- Once the connection is established, you can access the database and collections using `openDatabase()` and `openConnection()`.

## Contributing

If you'd like to report an issue or contribute to the project, please visit the [GitHub repository](https://github.com/GokselKUCUKSAHIN).

## Author

This package was developed by [Göksel KÜÇÜKŞAHİN](https://www.github.com/GokselKUCUKSAHIN).
