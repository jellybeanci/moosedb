import {mongoDbDriverFactory} from "../index";
import {using} from "using-statement";
import {readFileSync} from "fs";

class Main {
    static async insertOneTest(): Promise<void> {
        using(await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017"), async driver => {
            driver.db("test").get("new-table");
            const response = await driver.col().insertOne({my: 3, file: 4});
            console.log("response:", response);
        });
    }

    static async insertManyTest(): Promise<void> {
        const driver = await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017");
        driver.db("test").get("new-table");
        const response = await driver.col().insertMany([{multiple: 5, doc: 6}, {insert: 7, test: 8}]);
        console.log("response:", response);
        console.log("close response:", await driver.close());
    }

    static async findTest(): Promise<void> {
        using(await mongoDbDriverFactory("mongodb://super:password@10.1.8.88:27017"), async driver => {
            driver.db("test").get("new-table");
            const cursor = driver.col().find();
            await cursor.forEach(console.log);
        })
    }

    static async inseryDataset(): Promise<void> {
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

    static async sortAndLimit(): Promise<void> {
        using(await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017"), async driver => {
            const collection = driver.db("results").get("statistics");
            const top10 = await collection.find().sort({currency: -1}).limit(10).toArray();
            console.log(top10);
        });
    }

    public static async main(): Promise<void> {

    }
}

Main.main();