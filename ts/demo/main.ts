import {mongoDbDriverFactory} from "moosedb";

class Main {
  static async insertOneTest(): Promise<void> {
    const driver = await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017");
    driver.db("test").get("new-table");
    const response = await driver.insertOne({my: 3, file: 4});
    console.log("response:", response);
    console.log("close response:", await driver.close());
  }

  static async insertManyTest(): Promise<void> {
    const driver = await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017");
    driver.db("test").get("new-table");
    const response = await driver.insertMany([{multiple: 5, doc: 6}, {insert: 7, test: 8}]);
    console.log("response:", response);
    console.log("close response:", await driver.close());
  }

  public static async main(): Promise<void> {
    // await Main.insertOneTest();
    // await Main.insertManyTest();


  }
}

Main.main();