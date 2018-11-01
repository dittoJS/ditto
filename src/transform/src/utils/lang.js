// import prettier from 'prettier';
import { normalize } from 'path';
/**
 * Camelize a hyphen-delimited string.
 *
 * @param {String} str
 * @return {String}
 */

const camelizeRE = /-(\w)/g;
export function camelize (str) {
  return str.replace(camelizeRE, toUpper);
}

function toUpper (_, c) {
  return c ? c.toUpperCase() : "";
}

/**
 * Hyphenate a camelCase string.
 *
 * @param {String} str
 * @return {String}
 */

var hyphenateRE = /([^-])([A-Z])/g
export function hyphenate (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
}

/**
 * es5 to es6
 * @param {*} code 
 */
let fnRE = /(\w+)(\:\s+function\s*\w+)(\()/g
export function transformFn (code) {
  return code.replace(fnRE, '$1$3');
}

export function firstWordToUp (str) {
  let firstWord = str[0];
  let rest = str.substr(1);
  return firstWord + rest.toLowerCase();
}

export function eachObj (obj, cb) {
  Object.keys(obj).forEach(element => {
    if (cb) {
        cb(obj[element], element);
    }
  });
}

export function objectToString (obj = {}) {
    eachObj(obj, (item) => {
      if (typeof item === 'function') {
        obj[item] = item.toString();
      }
    });

    return JSON.stringify(obj);
}

export function deepCopy (obj) {
  let newVal;
  if (Array.isArray(obj)) {
    newVal = [];
    obj.forEach((item) => {
      newVal.push(deepCopy(item));
    })
  } else if (obj && typeof obj === 'object') {
    newVal = {};
    Object.keys(obj).forEach((item) => {
      newVal[item] = deepCopy(obj[item])
    })
  } else {
    newVal = obj;
  }
  return newVal;
}

/*
export function codePrettier (code) {
    try {
      code = prettier.format(code, {
        semi: false,
        tabWidth: 4,
        useTabs: true,
        parser: "babylon"
      });
    } catch (error) {
      console.log(error);
    }
    return code;
}*/

export function normalizeFn (fnString) {
  if (!fnString.match(/function/)) {
    fnString = 'function ' + fnString;
  }

  return fnString;
}