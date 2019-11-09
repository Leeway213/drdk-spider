import fs from 'fs-extra';
import { breakSentence } from './sentences-break';

console.log(process.argv);

const srcPath = process.argv[2];

if (srcPath) {
  const src = fs.readFileSync(srcPath, { encoding: 'utf-8' });
  const result = breakSentence(src);

  let lines = result.split('\n');
  // lines = lines.filter(v => v.split(' ').length >= 9 && v.split(' ').length <= 21);

  fs.writeFileSync('./result.txt', lines.join('\n'), { encoding: 'utf-8' });
}
