import { areaInfoByCode, stationByCode, stationMonthDataByCode } from './index.js'

// 区域编号
const code = '350211';

// 日期
const date = '202202';

// 测试区域代码获取区域信息
console.log('===========测试区域代码获取区域信息============');
console.log(areaInfoByCode(code));

// 测试区域代码获取区域气象站
console.log('===========测试区域代码获取区域气象站============');
console.log(stationByCode(code));

// 测试区域代码获取区域气象站月份数据
console.log('===========测试区域代码获取区域气象站月份数据============');
console.log(await stationMonthDataByCode(code, date));