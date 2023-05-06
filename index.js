const fuzzReq = require('./src/fuzzReq');
const fs = require('fs');
const readline = require('readline');
// const gentic = require('./gentic-js');

async function main() {
  const url = "https://140.116.165.105/~cos/ccdemo/sel/index.php?c=qry11215&m=save_qry";
  // const seed = ["", "", "1", "", "", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
  const file = './seed2.txt';
  const seed = getData(file);
  seed.shift();
  console.log(seed);
  seed.forEach(async (s) => {
    let cl = [];
    for (let i = 0; i < 16; i++) {
      if (s[5 + i] === "1") {
        cl.push(i + 1);
      }
    }
    cl = cl.toString();
    const data = {
      "id": "1",
      "cosname": s[0],
      "teaname": s[1],
      "wk": s[2],
      "dept_no": s[3],
      "degree": s[4],
      "cl": cl,
    };
    console.log(data);
    const time = await fuzzReq(url, data);
    console.log(`Execution time: ${time} ms`);
  });
}

function getData(file) {
  let data = [];
  const allContents = fs.readFileSync(file, 'latin1');
  
  allContents.split("\r\n").forEach((line) => {
    data.push(line.split("\t"));
  });
  return data;
}

main();
