const is = (type) => (val) => Object.prototype.toString.call(val) === `[object ${type}]`

export const isNumber = is('Number')

export const isObject = is('Object')

export const isArray = is('Array')

export const isUndef = val => val === null || val === undefined

export const isDef = val => val !== null && val !== undefined

export const isTrue = val => val === true

// 合并对象
export const merge = (...args) => {
  return Object.assign({}, ...args)
}
// 类型判断
export const isType = (detect, type) => {
  const types = ['String', 'Object', 'Number', 'Array', 'Undefined', 'Function', 'Null', 'Symbol'];
  const protoType = Object.prototype.toString.call(detect);
  if (!protoType) { return false };
  const detectType = protoType.replace(/^\[object\s([A-Za-z]+)\]$/, '$1');
  if (types.indexOf(detectType) < 0) { return false }
  return detectType === type;
}

// 对象转为字符串
export const objectToString = (style) => {
  if (style && typeof style === 'object') {
    let styleStr = '';
    Object.keys(style).forEach((key) => {
      const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      styleStr += `${lowerCaseKey}:${style[key]};`;
    });
    return styleStr;
  } if (style && typeof style === 'string') {
    return style;
  }
  return '';
};

export const noNull = (v) => isUndef(v) ? '' : v

export const deepClone = v => JSON.parse(JSON.stringify(v))

export const noop = () => { }
