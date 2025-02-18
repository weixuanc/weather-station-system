import stations from './data/weather_area_station.js';
import areaTable from './data/area_code.js';
import axios from 'axios';
import iconv from 'iconv-lite';

const proxyUrl = 'https://solariot.iot2.c2lightlink.com/api';
/**
 * 获取省市县地区信息
 * @param {string} code 6位区域代码
 */
export function getRegions (code) {
  if (code) {
    return areaTable[code];
  }
  return areaTable;
}
console.log(getRegions());
/**
 * 获取省市县地区气象站信息
 * @param {string} code 6位区域代码
 */
export function getStation (code) {
  if (code) {
    return stations.find(item => item.adcode === code);
  }
  return stations;
}
/**
 * 根据区域代码获取区域名称
 * /
 * @param {string} code 6位区域代码
 */
export function areaInfoByCode(code) {
  let areaNameInfo = {
    name: '未知',
    type: '未知',
    detail: {
      province: {
        code: null,
        name: null
      },
      city: {
        code: null,
        name: null
      },
      area: {
        code: null,
        name: null
      }
    }
  }
  if (code && String(code).length === 6 && !isNaN(code)) {
    if (code.endsWith('0000')) {
      // 省级
      areaNameInfo.detail.province.code = code;
      areaNameInfo.detail.province.name = areaTable['100000'][code] ?? null;
    } else if (code.endsWith('00')) {
      // 市级
      areaNameInfo.detail.province.code = code.substring(0, 2) + '0000';
      areaNameInfo.detail.province.name = areaTable['100000'][areaNameInfo.detail.province.code] ?? null;
      areaNameInfo.detail.city.code = code.substring(0, 4) + '00';
      areaNameInfo.detail.city.name = areaTable[areaNameInfo.detail.province.code]?.[areaNameInfo.city.code] ?? null;
    } else {
      // 区级
      areaNameInfo.detail.province.code = code.substring(0, 2) + '0000';
      areaNameInfo.detail.province.name = areaTable['100000']?.[areaNameInfo.detail.province.code] ?? null;
      areaNameInfo.detail.city.code = code.substring(0, 4) + '00';
      areaNameInfo.detail.city.name = areaTable?.[areaNameInfo.detail.province.code]?.[areaNameInfo.detail.city.code] ?? null;
      areaNameInfo.detail.area.code = code;
      areaNameInfo.detail.area.name = areaTable?.[areaNameInfo.detail.city.code]?.[areaNameInfo.detail.area.code] ?? null;
    }
    if (areaNameInfo.detail.province.name) {
      areaNameInfo.type = '省份';
      areaNameInfo.name = '';
      areaNameInfo.name += `${areaNameInfo.detail.province.name}`;
    }
    if (areaNameInfo.detail.city.name) {
      areaNameInfo.type = '城市';
      areaNameInfo.name += `-${areaNameInfo.detail.city.name}`;
    }
    if (areaNameInfo.detail.area.name) {
      areaNameInfo.type = '区县';
      areaNameInfo.name += `-${areaNameInfo.detail.area.name}`;
    }
  }
  return areaNameInfo;
}
/**
 * 根据区域代码获取区域气象站
 * /
 * @param {string} code 6位区域代码
 * @param {string} date 日期；示例：202502
 */
export function stationByCode(code) {
  let station = stations.find(item => item.adcode === code);
  return {
    ...areaInfoByCode(code),
    station: station ?? null
  }
}

/**
 * 根据区域代码获取区域气象站月份数据
 * /
 * @param {string} code 6位区域代码
 * @param {string} date 2022-02
 */
export async function stationMonthDataByCode(code, date) {
  const result = stationByCode(code);
  const csid = result?.station?.csid;
  let weatherInfo = null
  if (csid) {
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    let responseType = 'arraybuffer'
    if (isBrowser) responseType = 'text'
    try {
      let url = `${proxyUrl}/t/wea_history/js/${date}/${csid}_${date}.js`;
      let { data } = await axios.get(url, {
        responseType
      });
      // 天气历史数据是gbk编码的，需要转码
      let dataUtf8 = data
      if (!isBrowser) {
        dataUtf8 = iconv.decode(data, 'gbk');
      }
      const wea_history = new Function('return' + dataUtf8.substring(16, data.length - 1))()
      wea_history.tqInfo.pop(); // 去掉最后一行空数据
      weatherInfo = wea_history.tqInfo
    } catch (error) {
      console.error(error);
    }
  }
  return {
    ...result,
    weatherInfo
  }
}
/**
 * 根据经纬度和日期计算日落日出时间
 * /
 * @param {string} longitude 经度；示例：120
 * @param {string} latitude 纬度；示例：30
 * @param {string} date 日期；示例：2025-02-15
 */
export function calculateSunriseSunset(longitude, latitude, date) {
  let dateArray = date.split('-');
  let year = Number(dateArray[0]);
  let month = Number(dateArray[1]) - 1; // 日期，注意月份从 0 开始计数
  let day = Number(dateArray[2]);
  let dateObj = new Date(year, month, day);
  // 将日期转换为从 1 月 1 日开始的天数
  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((dateObj - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  // 计算太阳赤纬
  const solarDeclination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * (Math.PI / 180));

  // 计算日出日落时的太阳时角
  const cosHourAngle = -Math.tan(latitude * (Math.PI / 180)) * Math.tan(solarDeclination * (Math.PI / 180));
  if (cosHourAngle > 1) {
    // 极夜情况
    return {
      sunrise: null,
      sunset: null
    };
  }
  if (cosHourAngle < -1) {
    // 极昼情况
    return {
      sunrise: "00:00",
      sunset: "24:00"
    };
  }
  const hourAngle = Math.acos(cosHourAngle) * (180 / Math.PI);

  // 计算地方时（小时）
  const solarTime = hourAngle / 15;

  // 计算当地地方时
  const localOffset = (120 - longitude) / 15;
  const sunriseTime = 12 - solarTime + localOffset;
  const sunsetTime = 12 + solarTime + localOffset;

  // 将时间转换为 HH:mm 格式
  function formatTime(time) {
    if (time < 0) time += 24;
    if (time >= 24) time -= 24;
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  return {
    sunrise: formatTime(sunriseTime),
    sunset: formatTime(sunsetTime)
  };
}
