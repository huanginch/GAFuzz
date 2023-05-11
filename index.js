const fuzzReq = require('./src/fuzzReq');
const fs = require('fs');
const readline = require('readline');
const Genetic = require('genetic-js');
const axios = require('axios');

// genetic algorithm setting
console.log("Start genetic algorithm...");
let genetic = Genetic.create();
genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Tournament2;
genetic.select2 = Genetic.Select2.Tournament2;

genetic.seed = function () {
  let n = Math.floor(Math.random() * Object.keys(this.userData).length);
  return this.userData[n];
}

genetic.mutate = function (entity) {
  entity[2] = Math.floor(Math.random() * 7) + 1; //wk, generate 1 ~ 7
  entity[4] = Math.floor(Math.random() * 7) + 1; // degree, generate 1 ~ 7
  for(let i = 0; i < 16; i++) {
    entity[5 + i] = Math.floor(Math.random() * 2); //cl, generate 0 or 1
  }
  return entity;
};

genetic.crossover = function (mother, father) {
  // two-point crossover
  var len = Object.keys(mother).length;
  var ca = Math.floor(Math.random() * len);
  var cb = Math.floor(Math.random() * len);
  if (ca > cb) {
    var tmp = cb;
    cb = ca;
    ca = tmp;
  }

  let son = JSON.parse(JSON.stringify(father));;
  let daughter = JSON.parse(JSON.stringify(mother));;

  for (let i = ca; i < ca - cb; i++) {
    let temp = son[i];
    son[i] = daughter[i];
    daughter[i] = temp;
  }
  return [son, daughter];
};

genetic.fuzzReq = fuzzReq;

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
  const time = await this.fuzzReq(url, data);
  // console.log(`Execution time: ${time} ms`);
  return time;
};

let config = {
  "iterations": 1,
  "size": 250,
  "crossover": 0.9,
  "mutation": 0.2,
  "skip": 0
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
