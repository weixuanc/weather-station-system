import { stations } from './data/weather_area_station.js';
import areaTable from './data/area_code.js';
import axios from 'axios';
import iconv from 'iconv-lite';

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
export async function stationMonthDataByCode(code, month) {
  const result = stationByCode(code);
  const csid = result?.station?.csid;
  let weatherInfo = null
  if (csid) {
    try {
      let { data } = await axios.get(`https://tianqi.2345.com/t/wea_history/js/${month}/${csid}_${month}.js`, { responseType: 'arraybuffer' });
      // 2345天气历史数据是gbk编码的，需要转码
      const dataUtf8 = iconv.decode(data, 'gbk');
      const wea_history = new Function('return' + dataUtf8.substring(16, data.length - 1))()
      wea_history.tqInfo.pop(); // 去掉最后一行空数据
      weatherInfo = wea_history.tqInfo
    } catch (error) {
      // console.error('error');
    }
  }
  return {
    ...result,
    weatherInfo
  }
}
