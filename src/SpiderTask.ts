import { TaskBase } from "./task-scheduler/task-base";
import { parseArticle } from "./parseArticle";
import { saveToFile } from "./saveToFile";
import { TaskQueue } from "./task-scheduler/base";

export class SpiderTask extends TaskBase {
  constructor(public url: string, public resultDir: string) {
    super();
  }

  async exec() {
    console.log('开始爬取' + this.url);
    const article = await parseArticle(this.url);
    // saveToFile(`${this.resultDir}/${article.title}.txt`, `${article.url}\n\n\n${article.content}`);
    this.emit('finished', {
      url: this.url,
      content: article.content
    });
    console.log('爬取完成' + this.url);
  }
}

export class SpiderTaskQueue extends TaskQueue<SpiderTask> {
  execTask(task: SpiderTask) {
    return task.exec();
  }
}
