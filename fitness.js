import fuzzReq from './src/fuzzReq.js';
import target from './fuzztarget.json' assert { type: "json" };
import { appendFileSync } from 'fs';
import delay from './utils/delay.js';

const populationCSV = './res/Population.csv';

async function fitness(entity) {
  // console.log(entity);

  const url = target.url;
  const data = handle1111Paras5(entity);

  let resTimeArr = [];
  let error = true;
  let statusCode = "";
  for (let i = 0; i < 10; i++) {
    const res = await fuzzReq(url, data);
    if (res.statusCode.toString().charAt(0) === '2') {
      error = false;
    } else if (res.statusCode === "ECONNRESET") {
      console.log("ECONNRESET, fuzz again");
      i--;
      continue;
    }
    resTimeArr.push(res.resTime);
    statusCode = res.statusCode;

    await delay(1000); //delay 1s for each request
  }

  // fitness is the median of response time
  let median = resTimeArr.sort((a, b) => a - b)[Math.floor(resTimeArr.length / 2)];
  console.log(resTimeArr, median);
  let fitness = median;
  
  let mutateFunc = entity[36] === undefined ? "none" : entity[36];
  if (mutateFunc === "none") { //remove mutate function in entity
    entity[36] = "none";
  }
  entity.pop(); //remove mutate function in entity
  
  appendFileSync(populationCSV, `${fitness},`);
  entity.forEach((gene) => {
    const csvRegex = /[;\\\/,'"$!?:=&%]/;
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

const handle1111Paras = (entity) => {
  let data = {};
  entity.forEach((gene, index) => {
    if (index === 0) { //使用者輸入的關鍵字
      data["ks"] = gene;
    } else if (index === 1 && gene !== "") { //地區
      data["c0"] = gene;
    } else if (index === 2 && gene !== "") { //職務類別
      data["d0"] = gene;
    } else if (index === 3 && gene !== "") { //頁數
      data["page"] = gene;
    } else if (index === 4 && gene !== "") { //排序升降冪
      data["sort"] = gene;
    } else if (index === 5 && gene !== "") { //排序依據
      data["col"] = gene;
    } else if (index === 6 && gene !== "") { //篩選項目
      data["ts"] = gene;
    } else if (index === 7 && gene !== "") { //僅搜尋職缺名稱
      data["fs"] = gene;
    } else if (index === 8 && gene !== "") { //顯示限時回應的職缺
      data["ri"] = gene;
    } else if (index === 9 && gene !== "") { //排除已看過的職務
      data["vd"] = gene;
    } else if (index === 10 && gene !== "") { //可遠距
      data["uld"] = gene;
    } else if (index === 11 && gene !== "") { //職務
      data["t0"] = gene;
    } else if (index === 12 && gene !== "") { //資本額
      data["ca"] = gene;
    } else if (index === 13 && gene !== "") { //工作性質
      data["tt"] = gene;
    } else if (index === 14 && gene !== "") { //更新時間
      data["da"] = gene;
    } else if (index === 15 && gene !== "") { //薪資待遇下限
      data["sa0"] = gene;
    } else if (index === 16 && gene !== "") { //薪資待遇上限
      data["sa1"] = gene;
    } else if (index === 17 && gene !== "") { //薪資類別
      data["st"] = gene;
    } else if (index === 18 && gene !== "") { //工作經驗
      data["ex"] = gene;
    } else if (index === 19 && gene !== "") { //學歷
      data["gr"] = gene;
    } else if (index === 20 && gene !== "") { //工作時段
      data["wk"] = gene;
    } else if (index === 21 && gene !== "") { //休假制度
      data["va"] = gene;
    } else if (index === 22 && gene !== "") { //技能
      data["sk"] = gene;
    } else if (index === 23 && gene !== "") { //證照
      data["ce"] = gene;
    } else if (index === 24 && gene !== "") { //公司性質
      data["at"] = gene;
    } else if (index === 25 && gene !== "") { //公司福利
      data["xft"] = gene;
    } else if (index === 26 && gene !== "") { //員工人數
      data["sf"] = gene;
    } else if (index === 27 && gene !== "") { //外語需求
      data["lang0"] = gene;
    } else if (index === 28 && gene !== "") { //科系要求
      data["m0"] = gene;
    } else if (index === 29 && gene !== "") { //身分類別(學生、研替)
      data["mnd"] = gene;
    } else if (index === 30 && gene !== "") { //身分類別
      data["ch"] = gene;
    } else if (index === 31 && gene !== "") { //排除職務
      data["nk"] = "";
    } else if (index === 32 && gene !== "") { //排除公司
      data["nko"] = "";
    } else if (index === 33 && gene !== "") { //排除產業
      data["nt"] = gene;
    } else if (index === 34 && gene !== "") { //排除派遣
      data["nosf"] = gene;
    } else if (index === 35 && gene !== "") { //排除面議
      data["nst"] = gene;
    } 

  });

  return data;
}

const handle1111Paras5 = (entity) => {
  let data = {};
  entity.forEach((gene, index) => {
    if (index === 0) { //使用者輸入的關鍵字
      data["ks"] = gene;
    } else if (index === 1 && gene !== "") { //地區
      data["c0"] = gene;
    } else if (index === 2 && gene !== "") { //職務類別
      data["d0"] = gene;
    } else if (index === 3 && gene !== "") { //頁數
      data["page"] = gene;
    } else if (index === 4 && gene !== "") { //排序升降冪
      data["sort"] = gene;
    }

  });

  return data;
}

export { fitness };