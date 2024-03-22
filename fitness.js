import fuzzReq from './src/fuzzReq.js';
import target from './fuzztarget.json' assert { type: "json" };
import { appendFileSync } from 'fs';
import { delay } from 'rxjs';

const populationCSV = './res/Population.csv';

async function fitness(entity) {

  const url = target.url;
  const data = handlePChomeParas(entity);

  let resTimeArr = [];
  let error = true;
  let statusCode = "";
  for (let i = 0; i < 5; i++) {
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

  // fitness is the median of response time
  let median = resTimeArr.sort((a, b) => a - b)[Math.floor(resTimeArr.length / 2)];
  let fitness = median;

  let mutateFunc = entity[target.paramNum] === undefined ? "none" : entity[target.paramNum];
  if (mutateFunc === "none") { //remove mutate function in entity
    entity[target.paramNum] = "none";
  }
  entity.pop();

  appendFileSync(populationCSV, `${fitness},`);
  entity.forEach((gene) => {
    const csvRegex = /[;\\\/,'"$!?:=&%]/;
    if (csvRegex.test(gene)) {
      if (gene === "\"") {
        gene = "\"\""
        gene = "\"" + gene + "\"";
      } else if (gene.charAt(0) === '=') {
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

const handlePChomeParas = (entity) => {
  let data = {};
  entity.forEach((gene, index) => {
    if (index === 0) { //使用者輸入的關鍵字
      data["q"] = gene;
    } else if (index === 1 && gene !== "") { //排序方式
      data["sort"] = gene;
    } else if (index === 2 && gene !== "") { //價格範圍
      data["price"] = gene;
    } else if (index === 3 && gene !== "") { //商品狀態、取貨方式
      data["cond"] = gene;
    } else if (index === 4 && gene !== "") { //商品類別
      data["attrs"] = gene;
    } else if (index === 5 && gene !== "") { //頁數
      data["page"] = gene;
    }
  });

  return data;
}

export { fitness };