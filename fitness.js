import fuzzReq from './src/fuzzReq.js';
import target from './fuzztarget.json' assert { type: "json" };
import { appendFileSync } from 'fs';

const populationCSV = './res/Population.csv';

async function fitness(entity) {
  // console.log(entity);

  const url = target.url;
  const data = handleBookwakerParas(entity);

  let resTimeArr = [];
  let error = true;
  let statusCode = "";
  for (let i = 0; i < 3; i++) {
    const res = await fuzzReq(url, data);
    if (res.statusCode.toString().charAt(0) === '2') {
      error = false;
    } else if (res.statusCode === "ECONNRESET") {
      console.log("ECONNRESET, fuzz again");
      await delay(1000);
      i--;
      continue;
    }
    resTimeArr.push(res.resTime);
    statusCode = res.statusCode;
  }

  // fitness is the median of the response times
  let fitness = resTimeArr.sort((a, b) => a - b)[Math.floor(resTimeArr.length / 2)];

  let mutateFunc = entity[target.paramNum] === undefined ? "none" : entity[target.paramNum];
  if (mutateFunc === "none") {
    entity[target.paramNum] = "none";
  }
  entity.pop();

  appendFileSync(populationCSV, `${fitness},`);
  entity.forEach((gene) => {
    const csvRegex = /[;\\\/,'"$!?:=&%]/;
    if(gene === undefined) return;
    if (csvRegex.test(gene.charAt(0))) {
      if (gene === "\"") {
        gene = "\"\""
        gene = "\"" + gene + "\"";
      } else if (gene === "=") {
        gene = "\'" + gene;
      } else {
        gene = "\"" + gene + "\"";
      }
    }
    appendFileSync(populationCSV, `${gene},`);
  });
  appendFileSync(populationCSV, `${statusCode},`);
  appendFileSync(populationCSV, `${mutateFunc}\n`);

  return { fitness, state: { error, statusCode } };
}

const handleCSIEParas = (entity) => {
  let cl = [];
  if (entity[5] === "1") {
    for (let i = 0; i < 16; i++) {
      cl.push(i % 2);
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

  return data;
}

const handleBookwakerParas = (entity) => {
  let data = {};
  entity.forEach((gene, index) => {
    if (index === 0) {
      data["w"] = gene;
    } else if (index === 1) {
      data["m"] = gene;
    } else if (index === 2 && gene !== "") {
      data["vertical"] = gene;
    } else if (index === 3 && gene !== "") {
      data["restriced"] = gene;
    } else if (index === 4 && gene !== "") {
      data["page"] = gene;
    } else if (index === 5 && gene !== "") {
      data["order"] = gene;
    } else if (index === 6 && gene !== "") {
      data["detail"] = gene;
    }
  });

  return data;
}

export { fitness };