import axios from "axios";
import cheerio from "cheerio";
import { History } from "./history";
import { SpiderTask, SpiderTaskQueue } from "./SpiderTask";
import moment from "moment";
import { saveToFile } from "./saveToFile";
import { breakSentence } from "./utils/sentences-break";
import fs from "fs";

const taskQueue = new SpiderTaskQueue(30);
const outputDir = "./result";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

let subscribing = false;
taskQueue.on("finished", () => (subscribing ? undefined : process.exit()));

const history = new History("./result");

process.on("SIGINT", () => history.save());
process.on("exit", () => history.save());
process.on("disconnect", () => history.save());

const url = "https://www.dr.dk/nyheder/allenyheder/";
const rootUrl = "https://www.dr.dk";

(async () => {
  subscribing = true;
  for (let i = 0; i < 1000000; i++) {
    const date = moment()
      .subtract(i, "days")
      .format("DDMMYYYY");

    console.log(`订阅date${date}爬取任务...`);

    const res = await axios
      .get(`${url}/${date}`, {
        responseType: "text"
      })
      .then(res => res.data);
    const $ = cheerio.load(res);
    const drList = $(".dr-list");
    const hrefs = drList
      .find("article")
      .find("a")
      .toArray()
      .map(a => `${rootUrl}${$(a).attr("href")}`)
      .filter(href => !history.hasHistory(href, date));

    for (const href of hrefs) {
      console.log("订阅" + href);
      const task = new SpiderTask(href, outputDir);
      task.on("finished", (args: any) => {
        saveToFile(
          `${outputDir}/${date}.txt`,
          `${args.url}\n\n${breakSentence(args.content).replace(/[(]Foto(.*?)[)]/g, '')}\n\n\n\n\n`
        );
        history.push(date, href);
      });
      taskQueue.subscribe(task);
      taskQueue.publish();
    }
  }

  subscribing = false;
})();
