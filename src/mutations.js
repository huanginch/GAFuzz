const Mutation = {
  Random,
  BitFlip,
  Insertion,
  myMutation,
}

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

// mutation function
function Random(entity) {
  const cosname = ["", "桌球與健康體能", "大學國文（二）", "基礎學術英文", "外國語言（二）", "普通化學（二）", "微積分（二）", "統計學（二）", "生理學", "政治哲學概論", "線性代數", "服務學習（二）", "初階程式設計", "資訊英文", "普通物理學", "計算機概論", "日文", "修辭學", "世界文化史（二）", "中國上古史", "核融合電漿物理", "統計學（二）", "資訊管理概論", "有機化學", "醫師科學家", "認知心理學", "感覺與知覺"];
  const teaname = ["", "彭淑玲", "郭旭展", "林士鳴", "趙子元", "陳培殷", "陳旻宏", "楊毅", "劉厚均", "蕭仁傑", "林牛", "黃紀茸", "黃春融", "許富貴", "張泰榕", "劉之中", "王翠玲", "仇小屏", "張勝柏", "江達智", "河森榮一郎", "張博宇", "林松宏", "王婉倫", "劉梧柏", "王維聰", "王秀雲", "沈延盛", "謝淑蘭", "黃碧群"];
  
  entity[0] = cosname[Math.floor(Math.random() * cosname.length)]; //cosname, random select one
  entity[1] = teaname[Math.floor(Math.random() * teaname.length)]; //teaname, random select one
  entity[2] = Math.floor(Math.random() * 7) + 1; //wk, generate 1 ~ 7
  entity[3] = dept_no[Math.floor(Math.random() * dept_no.length)]; //dept_no, random select one
  entity[4] = Math.floor(Math.random() * 7) + 1; // degree, generate 1 ~ 7
  for (let i = 0; i < 16; i++) {
    entity[5 + i] = Math.floor(Math.random() * 2); //cl, generate 0 or 1
  }

  return entity;
}

function BitFlip(entity) {
  entity[0] = filpString(entity[0]); //cosname, filp string
  entity[1] = filpString(entity[1]); //teaname, filp string
  entity[2] = Math.floor(Math.random() * 7) + 1; //wk, generate 1 ~ 7
  entity[3] = dept_no[Math.floor(Math.random() * dept_no.length)]; //dept_no, random select one
  entity[4] = Math.floor(Math.random() * 7) + 1; // degree, generate 1 ~ 7
  for (let i = 0; i < 16; i++) {
    if (Math.random() < 0.5) {
      entity[5 + i] = 1 - entity[5 + i];
    }
  }

  return entity;
}

function myMutation(entity) {
  let n = Math.floor(Math.random() * 3);
  entity[0] = strMutate[n](entity[0]); //cosname, mutate string
  while (entity[0].length > 20) {
    entity[0] = strMutate[1](entity[0]); // cosname, delete string if length > 20
  }

  n = Math.floor(Math.random() * 3);
  entity[1] = strMutate[n](entity[1]); //teaname, mutate string
  while (entity[1].length > 6) {
    entity[1] = strMutate[1](entity[1]); // teaname, delete string if length > 6
  }

  entity[2] = Math.floor(Math.random() * 7) + 1; //wk, generate 1 ~ 7
  entity[3] = dept_no[Math.floor(Math.random() * dept_no.length)]; //dept_no, random select one
  entity[4] = Math.floor(Math.random() * 7) + 1; // degree, generate 1 ~ 7
  for (let i = 0; i < 16; i++) {
    if (Math.random() < 0.5) {
      entity[5 + i] = 1 - entity[5 + i];
    }
  }

  return entity;
}     

const strMutate = [
  insertStr,
  deleteStr,
  filpStr,
  swapStr,
]

function Insertion(entity) {
  entity[0] = insertString(entity[0]); //cosname, insert string
  entity[1] = insertString(entity[1]); //teaname, insert string
  entity[2] = Math.floor(Math.random() * 7) + 1; //wk, generate 1 ~ 7
  entity[3] = dept_no[Math.floor(Math.random() * dept_no.length)]; //dept_no, random select one
  entity[4] = Math.floor(Math.random() * 7) + 1; // degree, generate 1 ~ 7
  for (let i = 0; i < 16; i++) {
    entity[5 + i] = Math.floor(Math.random() * 2); //cl, generate 0 or 1
  }

  return entity;
}

// untility function
function insertStr(str) {
  let newstr = "";
  let index = Math.floor(Math.random() * str.length);
  newstr = str.slice(0, index) + randomUTF8() + str.slice(index, str.length);
  return newstr;
}

function deleteStr(str) {
  if (str === "") {
    return str;
  }
  let newstr = "";
  let index = Math.floor(Math.random() * str.length);
  newstr = str.slice(0, index) + str.slice(index + 1, str.length);
  return newstr;
}

function filpStr(str) {
  let newstr = "";
  let index = Math.floor(Math.random() * str.length);
  newstr = str.slice(0, index) + String.fromCharCode(~str.charCodeAt(index)) + str.slice(index + 1, str.length);
  return newstr;
}

function swapStr(str) {
  let newstr = "";
  for (let i = 0; i < str.length; i++) {
    if (Math.random() < 0.5) {
      newstr += str[i];
    } else {
      if (i + 1 < str.length) {
        newstr += str[i + 1];
        newstr += str[i];
        i++;
      } else {
        newstr += str[i];
      }
    }
  }
  return newstr;
}

function randomUTF8() {
  // random generate a Chinese UTF-8 character
  const start = 0x4E00;
  const end = 0x9FA5;
  let offset = Math.floor(Math.random() * (end - start + 1));
  let code = start + offset;
  return String.fromCharCode(code);
}

module.exports = Mutation;