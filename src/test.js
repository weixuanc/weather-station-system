import { areaInfoByCode, stationByCode, stationMonthDataByCode, calculateSunriseSunset }  from './index.js';

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

// 测试经纬度和日期计算日落日出时间
const longitude = 118.0922581; // 经度，单位：度
const latitude = 24.5780219; // 纬度，单位：度
const date2 = '2025-02-21'; // 日期
const result = calculateSunriseSunset(longitude, latitude, date2);
console.log(`日出时间: ${result.sunrise}`);
console.log(`日落时间: ${result.sunset}`);