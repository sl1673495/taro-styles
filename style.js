import { isNumber, isObject, isUndef, isTrue, merge, objectToString } from './tool'

/**
 * 
 * @param {Object} styles 
 */
export const createStyles = (styles) => {
  if (!styles) {
    return {}
  }

  handleStyle(styles)
  return styles
}

// 转成设计图2倍的rpx
export const toRpx = (number) => {
  if (typeof number !== 'number') {
    return number
  }
  return `${number * 2}rpx`
}

// 类似classnames 具有缓存机制 
// 组件在同一个styles表重复切换key不会多次创建对象
// 传入styles, { style1: true, style2: false }
// 会从styles从筛选出值为true的key的styles合并返回 
export const styleNames =  (() => {
  const CACHE_KEY = '__cacheId__'
  const caches = {}
  let styleId = 0

  return (styles, keyMap) => {
    // 初次读取 在styles中建立id值 
    if (isUndef(styles[CACHE_KEY])) {
      Object.defineProperty(styles, CACHE_KEY, {
        value: styleId++,
        enumerable: false,
        writable: false,
      })
    }

    const cacheId = styles[CACHE_KEY]
    let cacheMap= caches[cacheId]
    // 尝试从缓存表中取
    if (!cacheMap) {
      cacheMap = caches[cacheId] = {}
    }

    const pickedKeys = Object.keys(keyMap).filter(key => isTrue(keyMap[key]))
    // 选中的key值拼接起来 做为缓存key
    const pickedKeysStr = pickedKeys.toString()
    let retStyles = cacheMap[pickedKeysStr]
    if (!retStyles) {
      // 没有缓存的情况下 利用merge去创建一个新的合并样式对象
      retStyles = cacheMap[pickedKeysStr] = merge(...pickedKeys.map(key => styles[key]))
    }
    return retStyles
  }
})()

// 合并style
export const mergeStyle = (style1, style2) => {
  return objectToString(style1) + objectToString(style2);
}

/**
 * 
 * @param {Object} styles
 */
const handleStyle = (styles) => {

  const _handleValue = (obj, key) => {
    const value = obj[key]
    // 子元素还是对象的话递归处理
    if (isObject(value)) {
      Object.keys(value).forEach(key => {
        _handleValue(value, key)
      })
      return
    }
    _handleNumberToRpx(obj, key, value)
    _handleMarginAndPadding(obj, key, value)
  }

  Object.keys(styles).forEach(key => {
    _handleValue(styles, key)
  })
}

// 需要转成rpx的样式
const NumberToRpxMap = {
  width: true,
  height: true,
  minWidth: true,
  minHeight: true,
  bottom: true,
  top: true,
  left: true,
  right: true,
  borderRadius: true,
  borderWidth: true,
  borderTopWidth: true,
  borderBottomWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  lineHeight: true,
  fontSize: true,
}

// 转rpx
const _handleNumberToRpx = (obj, key, value) => {
  if (
    // 需要由数字转成rpx
    NumberToRpxMap[key] &&
    isNumber(value)
  ) {
    obj[key] = toRpx(value)
  }
}

// 边距转换
const _handleMarginAndPadding = (obj, key, value) => {
  if (isNumber(value)) {
    if (isSingle(key)) {
      obj[key] = toRpx(value)
    } else if (isDouble(key)) {
      if (isMargin(key)) {
        if (isHorizontal(key)) {
          obj['marginLeft'] = toRpx(value)
          obj['marginRight'] = toRpx(value)
        } else {
          obj['marginTop'] = toRpx(value)
          obj['marginBottom'] = toRpx(value)
        }
      }
      if (isPadding(key)) {
        if (isHorizontal(key)) {
          obj['paddingLeft'] = toRpx(value)
          obj['paddingRight'] = toRpx(value)
        } else {
          obj['paddingTop'] = toRpx(value)
          obj['paddingBottom'] = toRpx(value)
        }
      }
      delete obj[key]
    } else if (isMuilt(key)) {
      if (isMargin(key)) {
        obj['marginLeft'] = toRpx(value)
        obj['marginRight'] = toRpx(value)
        obj['marginTop'] = toRpx(value)
        obj['marginBottom'] = toRpx(value)
      }
      if (isPadding(key)) {
        obj['paddingLeft'] = toRpx(value)
        obj['paddingRight'] = toRpx(value)
        obj['paddingTop'] = toRpx(value)
        obj['paddingBottom'] = toRpx(value)
      }
      delete obj[key]
    }
  }
}

const isMargin = (key) => key.startsWith('margin')

const isPadding = (key) => key.startsWith('padding')

const isMarginOrPadding = (key) => isMargin(key) || isPadding(key)

const isVertical = (key) => key.includes('Vertical')

const isHorizontal = (key) => key.includes('Horizontal')

// 单边距值
const isSingle = (key) => isMarginOrPadding(key) && (
  key.includes('Left') || key.includes('Right') || key.includes('Top') || key.includes('Bottom')
)

// 双边距值
const isDouble = key => isMarginOrPadding(key) && (
  isHorizontal(key) || isVertical(key)
)

// 多边距值
const isMuilt = (key) => /^padding$/.test(key) || /^margin$/.test(key)
