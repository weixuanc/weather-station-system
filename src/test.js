import { areaInfoByCode, stationByCode, stationMonthDataByCode } from './index.js'

// 测试区域代码获取区域信息
console.log('===========测试区域代码获取区域信息============');
console.log(areaInfoByCode('350211'));

// 测试区域代码获取区域气象站
console.log('===========测试区域代码获取区域气象站============');
console.log(stationByCode('350211'));

// 测试区域代码获取区域气象站月份数据
console.log('===========测试区域代码获取区域气象站月份数据============');
console.log(await stationMonthDataByCode('350211', '202202'));