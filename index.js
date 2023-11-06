import { writeFile, appendFileSync, openSync, writeFileSync, statSync, closeSync } from 'fs';

import Genetic from './src/genetic/index.js';
import Select from './src/Selection/index.js'
import { Crossover } from './src/Crossover/index.js';
import { Mutation } from './src/Mutation/index.js';
import { fitness } from './fitness.js';

import { getData } from './utils/getData.js';
import { writeFitness } from './utils/writeFitness.js';

// setting
let file = './seeds/1111-seed.txt';
let seed = getData(file);
seed.shift(); // remove header row
const fittestNSurvives = 15;
const config = {
  mutationFunction: Mutation,
  crossoverFunction: Crossover.uniform,
  fitnessFunction: fitness,
  fittestNSurvives, // number of fittest survive
  populationSize: 50, // number of population
  select1: Select.RouletteWheel,
  select2: Select.RouletteWheel,
  mutateProbablity: 0.2, // perturb prob random phenotype DNA
  crossoverProbablity: 0.5, // crossover prob
};

const genetic = new Genetic(config);
let GENERATION = 50;

let populationCSV = openSync('./res/Population.csv', 'w');

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
    populationCSV = openSync('./res/Population.csv', 'a');
    appendFileSync(populationCSV, `Generation ${i}\n`);
    closeSync(populationCSV);

    // estimate fitness three times and take average
    await genetic.estimate();

    writeFitness(fitnessCSV, genetic.population, i, fittestNSurvives);

    // sort population by fitness
    genetic.population.sort((a, b) => {
      return b.fitness - a.fitness;
    });

    const popLen = genetic.population.length;
    const mean = genetic.getMean();
    const meanWithoutElite = genetic.getMeanWithoutElite();
    genetic.stats = {
      population: genetic.population.length,
      maximum: genetic.population[0].fitness,
      minimum: genetic.population[popLen - 1].fitness,
      mean,
      meanWithoutElite,
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
