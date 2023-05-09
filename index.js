const fuzzReq = require('./src/fuzzReq');
const fs = require('fs');
const readline = require('readline');
const Genetic = require('genetic-js');

// genetic algorithm setting
console.log("Start genetic algorithm...");
let genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

genetic.seed = function () {
  // let n = Math.floor(Math.random() * this.userData.length);
  console.log(this.userData);
  return this.userData;
}
// genetic.mutate = function (entity) {
// };
// genetic.crossover = function (mother, father) {
//   // two-point crossover
//   var len = mother.length;
//   var ca = Math.floor(Math.random() * len);
//   var cb = Math.floor(Math.random() * len);
//   if (ca > cb) {
//     var tmp = cb;
//     cb = ca;
//     ca = tmp;
//   }

//   var son = father.substr(0, ca) + mother.substr(ca, cb - ca) + father.substr(cb);
//   var daughter = mother.substr(0, ca) + father.substr(ca, cb - ca) + mother.substr(cb);

//   return [son, daughter];
// };
genetic.fitness = async function (entity) {
  // console.log(entity);
  const url = "https://140.116.165.105/~cos/ccdemo/sel/index.php?c=qry11215&m=save_qry";
  let cl = [];
  for (let i = 0; i < 16; i++) {
    if (entity[5 + i] === "1") {
      cl.push(i + 1);
    }
  }
  cl = cl.toString();
  const data = {
    "id": "1",
    "cosname": entity[0],
    "teaname": entity[1],
    "wk": entity[2],
    "dept_no": entity[3],
    "degree": entity[4],
    "cl": cl,
  };
  // console.log(data);
  const time = await fuzzReq(url, data);
  console.log(`Execution time: ${time} ms`);
  return time;
};

// genetic.generation = function (pop, generation, stats) {
//   // stop running once we've reached the solution

// }

let config = {
  "iterations": 1,
  "size": 250,
  "crossover": 0.3,
  "mutation": 0.3,
  "skip": 20
};
let file = './seed.txt';
let userData = getData(file);
userData.shift(); // remove header row
genetic.evolve(config, userData);

function getData(file) {
  let data = [];
  const allContents = fs.readFileSync(file, 'utf8');
  
  allContents.split("\r\n").forEach((line) => {
    data.push(line.split("\t"));
  });
  return data;
}
