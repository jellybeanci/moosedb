import {mongoDbDriverFactory} from "moosedb";

class Main {
  public static async main(): Promise<void> {
    const driver = await mongoDbDriverFactory("mongodb://superUser:pass123@10.1.8.88:27017");
    driver.db("test").get("new-table");
    const response = await driver.insertOne({hello: 1, world: 2});
    console.log("response:", response);
    console.log("close response:", await driver.close());
  }
}

Main.main();