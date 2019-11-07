import fs from 'fs-extra';

export class History {

  get filePath() {
    return `${this.root}/${this.FILENAME}`;
  }

  history: { [date: string]: string[] } = {};

  private readonly FILENAME = 'history.json';

  constructor(public root: string) {
    if (!fs.existsSync(root)) {
      fs.mkdirpSync(root);
    }

    if (fs.existsSync(this.filePath)) {
      this.history = JSON.parse(fs.readFileSync(this.filePath, { encoding: 'utf-8' })) || {};
    }
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.history, null, 2), { encoding: 'utf-8' });
  }

  push(date: string, url: string) {
    this.history[date] = (this.history[date] || []);
    this.history[date].push(url);
  }

  hasHistory(url: string, date: string) {
    return (this.history[date] || []).includes(url);
  }

  getdateguage(date: string) {
    this.history[date] = this.history[date] || [];
    return this.history[date];
  }
}
