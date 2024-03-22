import fuzzReq from './src/fuzzReq.js';
import target from './fuzztarget.json' assert { type: "json" };
import { appendFileSync } from 'fs';
import { delay } from 'rxjs';

const populationCSV = './res/Population.csv';

async function fitness(entity) {

  const url = target.url;
  const data = handleDictParas(entity);

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
  if (entity[target.paramNum] === undefined) { //remove mutate function in entity
    entity[target.paramNum] = '';
  }
  entity.pop(); //remove mutate function in entity

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

const handleDictParas = (entity) => {
  let data = {};
  if(entity[2] !== "1") {
    entity[3] = '';
  }
  entity.forEach((gene, index) => {
    if (index === 0) { //使用者輸入的關鍵字
      data["word"] = gene;
    } else if (index === 1) { //基本或進階搜尋
      data["md"] = gene;
    } else if (index === 2 && gene !== "") { //關鍵字或義類
      data["qMd"] = gene;
    } else if (index === 3 && gene !== "") { //搜索範圍
      data["qCol"] = gene;
    } else if (index === 4 && gene !== "") { //每頁資料筆數
      data["size"] = gene;
    } else if (index === 5 && gene !== "") { //排序方式
      data["order"] = gene;
    } else if (index === 6 && gene !== "") { //形構檢查
      data["compose"] = gene;
    } else if (index === 7 && gene !== "") { //關鍵字位置
      data["pos0"] = "4%2C25";
    } else if (index === 8 && gene !== "") { //關鍵字位置
      data["pos"] = gene;
    } else if (index === 9 && gene !== "") { //字數下限
      data["len"] = gene;
    } else if (index === 10 && gene !== "") { //字數上限
      data["len0"] = gene;
    }
  });

  return data;
}

export { fitness };