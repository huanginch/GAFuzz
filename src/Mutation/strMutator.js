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

const strMutator = [
  insertStr,
  deleteStr,
  filpStr,
  swapStr,
]

export default strMutator;