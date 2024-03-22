/**
 * Insert one character in string with 50% probability
 */
function insertStr(str) {
  let newstr = "";
  let index = Math.floor(Math.random() * str.length);
  newstr = str.slice(0, index) + randomUTF8() + str.slice(index, str.length);
  return newstr;
}

/**
 * Delete one character in string with 50% probability
 */
function deleteStr(str) {
  if (str === "") {
    return str;
  }
  let newstr = "";
  let index = Math.floor(Math.random() * str.length);
  newstr = str.slice(0, index) + str.slice(index + 1, str.length);
  return newstr;
}

/**
 * Flip one character in string with 50% probability
 */
function filpStr(str) {
  let newstr = "";
  let index = Math.floor(Math.random() * str.length);
  newstr = str.slice(0, index) + String.fromCharCode(~str.charCodeAt(index)) + str.slice(index + 1, str.length);
  return newstr;
}

/**
 * Swap each two adjacent characters in string with 50% probability
 */
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

/**
 * Duplicate each character in string with 50% probability
 */
function duplicateStr(str) {
  let newstr = "";
  for (let i = 0; i < str.length; i++) {
    if (Math.random() < 0.5) {
      newstr += str[i];
      newstr += str[i];
      i++; // skip the next character
    } else {
      newstr += str[i];
    }
  }
  return newstr;
}

/**
 * Copy the string
 */
function copyStr(str) {
  return str + str;
}

/**
 * Insert % in the string, % is the wildcard character in SQL
 */
function insertPercent(str) {
  let newstr = "";
  newstr = "%" + str + "%";
  return newstr;
}

/**
 * Insert _ in the string, _ is the wildcard character in SQL
 */
function insertUnderline(str) {
  let newstr = "";
  newstr = str + "_";
  return newstr;
}

/**
 * Random generate a Chinese UTF-8 character
 */
function randomUTF8() {
  // random generate a Chinese UTF-8 character
  const start = 0x4E00;
  const end = 0x9FA5;
  let offset = Math.floor(Math.random() * (end - start + 1));
  let code = start + offset;
  return String.fromCharCode(code);
}

const strMutator = [
  filpStr,
  deleteStr,
  insertStr,
  swapStr,
  duplicateStr,
  copyStr,
  insertPercent,
  insertUnderline
]

export default strMutator;