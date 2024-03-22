import { readFileSync } from 'fs';

function getData(file) {
  let data = [];
  const allContents = readFileSync(file, 'utf8');

  allContents.split("\r\n").forEach((line) => {
    data.push(line.split("\t"));
  });
  return data;
}

export { getData };