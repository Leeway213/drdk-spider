import fs from "fs-extra";
import { breakSentence } from "./utils/sentences-break";

export function saveToFile(path: string, content: string) {
  if (fs.existsSync(path)) {
    fs.appendFileSync(path, content, { encoding: "utf-8" });
  } else {
    fs.writeFileSync(path, content, { encoding: "utf-8" });
  }
}
