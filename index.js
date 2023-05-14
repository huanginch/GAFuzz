const fuzzReq = require('./src/fuzzReq');
const fs = require('fs');
const { Genetic, Select } = require('async-genetic');
const { plot } = require('nodeplotlib');

// setting
const config = {
  mutationFunction: mutation,
  crossoverFunction: crossover,
  fitnessFunction: fitness,
  fittestNSurvives: 1, // number of fittest survive
  select1: Select.Tournament3,
  select2: Select.Tournament3,
  mutateProbablity: 0.2, // perturb prob random phenotype DNA
  crossoverProbablity: 0.9, // crossover prob
}

let file = './seed.txt';
let seed = getData(file);
seed.shift(); // remove header row

const genetic = new Genetic(config);
let GENERATION = 10;

// genetic algorithm setting
console.log("Start genetic algorithm...");

async function solve () {
  await genetic.seed(seed);
  const maxResponseTimes = [];

  for (let i = 0; i < GENERATION; i++) {
    await genetic.estimate();
    console.log(`Generation ${i + 1} completed`);
    const best = await genetic.best()[0];
    console.log("best: ", best);
    maxResponseTimes.push(best.fitness);
    // console.log(population);
    if (i === GENERATION - 1) {
      console.log("Best result: ", best);
    } else {
      await genetic.breed();
    }

  }

  // write result to file
  fs.writeFile('./result.txt', JSON.stringify(genetic.population), "utf-8", (err) => {
    if (err) throw err;
  });
  
  // plot max response time
  const data = [{
    x: Array.from(Array(GENERATION).keys()),
    y: maxResponseTimes,
    type: 'scatter'
  }]
  
  plot(data);
}

solve();


// functions
async function mutation (entity) {
  const dept_no = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A9", "AF", "AG", "AA", "AH", "AN", 
                  "C0", "W1", "M1", "M2", "M3", "M4", "M5", "MZ", "J0", "M0", "NM", "NN", "NP", 
                  "B0", "B1", "B2", "B3", "B4", "B5", "K1", "K2", "K3", "K4", "K5", "K7", "K8",
                  "KZ", "C1", "C2", "C3", "C4", "CZ", "F8", "L1", "L2", "L3", "L4", "L7", "LA",
                  "LZ", "VF", "VP", "E0", "E1", "E2", "E3", "E4", "E5", "E6", "E8", "E9", "F0", 
                  "F1", "F4", "F5", "F6", "F9", "N0", "N1", "N2", "N3", "N4", "N5", "N6", "N8",
                  "N9", "NA", "NB", "NC", "NF", "P0", "P1", "P4", "P5", "P6", "P8", "P4", "Q4",
                  "VQ", "H1", "H2", "H3", "H4", "H5", "HZ", "R0", "R1", "R2", "R3", "R4", "R5",
                  "R6", "R7", "R8", "R9", "RA", "RB", "RD", "RE", "RF", "RZ", "VR", "VT", "VY",
                  "I2", "I3", "I5", "I6", "I7", "I8", "I9", "S0", "S1", "S2", "S3", "S4", "S5",
                  "S6", "S7", "S8", "S9", "SA", "SB", "SC", "T1", "T2", "T3", "T4", "T6", "T7",
                  "T8", "T9", "TA", "TC", "D0", "D2", "D4", "D5", "D8", "U1", "U2", "U3", "U5",
                  "U7", "U8", "E2", "F7", "N2", "ND", "NE", "NQ", "P7", "P9", "Q1", "Q3", "Q5",
                  "Q6", "Q7", "V6", "V8", "V9", "VA", "VB", "VC", "VD", "VE", "VG", "VH", "VK",
                  "VM", "VN", "VO", "VS", "VU", "VV", "VW", "VX", "E7", "F2", "F3", "FZ", "N7",
                  "P2", "P3", "PA", "PB", "PZ", "C5", "C6", "L5", "L6", "Z0", "Z2", "Z3", "Z5"];
  entity[2] = Math.floor(Math.random() * 7) + 1; //wk, generate 1 ~ 7
  entity[3] = dept_no[Math.floor(Math.random() * dept_no.length)]; //dept_no, random select one
  entity[4] = Math.floor(Math.random() * 7) + 1; // degree, generate 1 ~ 7
  for(let i = 0; i < 16; i++) {
    entity[5 + i] = Math.floor(Math.random() * 2); //cl, generate 0 or 1
  }
  
  return entity;
};

async function crossover (mother, father) {
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

async function fitness (entity) {
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
  const time = await fuzzReq(url, data);
  let fitness = time;
  return { fitness, state: {} };
};

function getData(file) {
  let data = [];
  const allContents = fs.readFileSync(file, 'utf8');
  
  allContents.split("\r\n").forEach((line) => {
    data.push(line.split("\t"));
  });
  return data;
}
