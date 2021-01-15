import * as anadictData from './anadict.json'
import * as TWL06Data from './TWL06.json'

// theres gotta be a better way to do this

const dataToStr = JSON.stringify(anadictData)
const strToObj = JSON.parse(dataToStr)
const objToMap = new Map<string, string[]>(strToObj.default)

export const anadict = objToMap;

const dataToStr2 = JSON.stringify(TWL06Data)
const strToObj2 = JSON.parse(dataToStr2)
const objToSet = new Set(strToObj2.default)

export const TWL06Dict = objToSet