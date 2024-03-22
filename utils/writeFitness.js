import { appendFileSync } from 'fs';

function writeFitness(csvFile, data, i, fittestNSurvives = 10) {
  if (i !== 0) {
    data = data.slice(fittestNSurvives, data.length);
  }
  data.forEach((line) => {
    appendFileSync(csvFile, `${line.fitness}\n`, 'utf8');
  });
}

export { writeFitness };