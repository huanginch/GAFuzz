import fuzzReq from './src/fuzzReq.js';
import { writeFile, readFileSync, appendFileSync, openSync, writeFileSync } from 'fs';
import Genetic from './src/genetic/index.js';
import Select from './src/Selection/index.js'
import { Crossover } from './src/Crossover/index.js';
import { Mutation } from './src/Mutation/index.js';

// setting
let file = './seed.txt';
let seed = getData(file);
seed.shift(); // remove header row
const fittestNSurvives = 10;
const config = {
  mutationFunction: Mutation.myMutation,
  crossoverFunction: Crossover.uniform,
  fitnessFunction: fitness,
  fittestNSurvives, // number of fittest survive
  populationSize: 100, // number of population
  select1: Select.Rank,
  select2: Select.RouletteWheel,
  mutateProbablity: 0.2, // perturb prob random phenotype DNA
  crossoverProbablity: 0.9, // crossover prob
};

const genetic = new Genetic(config);
let GENERATION = 50;

const populationCSV = openSync('./res/Population.csv', 'w');

// genetic algorithm setting
console.log("Start genetic algorithm...");

async function solve() {
  await genetic.seed(seed);
  const maxResponseTimes = [];
  const meanResponseTimes = [];
  const stdev = [];
  const errorEntities = [];

  const fitnessCSV = openSync('./res/Fitness.csv', 'w');
  appendFileSync(fitnessCSV, `Fitness\n`);

  for (let i = 0; i < GENERATION; i++) {
    console.log(`Generation ${i} pending... `);
    appendFileSync(populationCSV, `Generation ${i}\n`);

    // estimate fitness three times and take average
    await genetic.estimate();

    writeFitness(fitnessCSV, genetic.population, i);

    // sort population by fitness
    genetic.population.sort((a, b) => {
      return b.fitness - a.fitness;
    });

    const popLen = genetic.population.length;
    const mean = genetic.getMean();
    genetic.stats = {
      population: genetic.population.length,
      maximum: genetic.population[0].fitness,
      minimum: genetic.population[popLen - 1].fitness,
      mean,
      stdev: genetic.getStdev(mean),
    };

    const best = genetic.best();
    maxResponseTimes.push(genetic.stats.maximum);
    meanResponseTimes.push(genetic.stats.mean);
    stdev.push(genetic.stats.stdev);

    genetic.population.forEach((entity) => {
      if (entity.state.error === true) {
        errorEntities.push(entity);
      }
    });

    if (i === GENERATION - 1) {
      console.log("Best result: ", best);
    } else {
      await genetic.breed();
    }

    console.log(`Generation ${i} completed! `);
  }

  errorEntities.forEach((entity) => {
    console.log(entity);
  });

  // write result to file
  writeFile('./res/result.json', JSON.stringify(genetic.population), "utf-8", (err) => {
    if (err) throw err;
  });

  // write max response time and mean response time to csv file
  writeFileSync('./res/MaxResponseTime.csv', 'Generation,Fitness\n', (err) => {
    if (err) throw err;
  });

  for (let i = 0; i < GENERATION; i++) {
    appendFileSync('./res/MaxResponseTime.csv', `${i + 1},${maxResponseTimes[i].toString()}\n`);
  }

  writeFileSync('./res/MeanResponseTime.csv', 'Generation,Fitness\n', (err) => {
    if (err) throw err;
  });
  for (let i = 0; i < GENERATION; i++) {
    appendFileSync('./res/MeanResponseTime.csv', `${i + 1},${meanResponseTimes[i].toString()}\n`);
  }
}

solve();

// fitness function
async function fitness(entity) {
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

  let resTimeArr = [];
  let statusCode = 0;
  let error = true;

  for (let i = 0; i < 10; i++) {
    const { resTime, statusCode: code } = await fuzzReq(url, data);
    resTimeArr.push(resTime);
    statusCode = code;
    if (statusCode.toString().charAt(0) === "2") {
      error = false;
    }
  }
  const mid = resTimeArr.length / 2;
  let resTimeArrSorted = JSON.parse(JSON.stringify(resTimeArr));
  resTimeArrSorted.sort((a, b) => { return b - a; });
  let fitness = (resTimeArrSorted[mid] + resTimeArrSorted[mid - 1]) / 2;
  console.log(resTimeArr);

  // write result to file
  resTimeArr.forEach((resTime) => {
    appendFileSync(populationCSV, `${resTime},`);
  });
  appendFileSync(populationCSV, `${fitness},${entity},${statusCode}\n`);

  // console.log(`fitness: ${fitness}, error: ${error}, statusCode: ${statusCode}`);
  return { fitness, state: { error, statusCode } };
}

// utility functions
function getData(file) {
  let data = [];
  const allContents = readFileSync(file, 'utf8');

  allContents.split("\r\n").forEach((line) => {
    data.push(line.split("\t"));
  });
  return data;
}

function writeFitness(csvFile, data, i) {
  if (i !== 0) {
    data = data.slice(fittestNSurvives, data.length);
  }
  data.forEach((line) => {
    appendFileSync(csvFile, `${line.fitness}\n`, 'utf8');
  });
}
