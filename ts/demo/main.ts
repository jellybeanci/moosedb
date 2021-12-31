import {mongoDbDriverFactory} from "../index";
import {using} from "using-statement";

const sleep = (ms) => new Promise(v => setTimeout(v, ms));

class Main {
  static async insertOneTest(): Promise<void> {
    using(await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017"), async (driver) => {
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
    using(await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017"), async driver => {
      // driver.db("test").get("new-table");
      driver.close();
      const cursor = driver.col().find();
      await cursor.forEach(console.log);
    }).catch(err => {
      console.error("Error!", err.message);

    });
  }

  public static async main(): Promise<void> {
    // await Main.insertOneTest();
    // await Main.insertManyTest();
    await Main.findTest();
    await sleep(5000);
  }
}

Main.main();