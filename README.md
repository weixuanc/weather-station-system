# 气象站数据（仅支持中国城市数据）
> 模块提供区域编码获取地区信息、区域编码获取气象站信息、区域编码获取历史气象数据三个功能。其中获取历史气象数据需要联网。

## 参数说明

字段|描述|备注
---|---|---
lng|经度|示例：118.100869
lat|纬度|示例：24.572874
csid|城市气象站ID|示例：59134，福建省厦门市的气息站ID
sid|气象台站号ID|示例：71919，气象站ID，福建省厦门市集美区的气息站ID
hcode|气象台站号对应的天气ID|示例：CN101230206，集美区气息站对应的天气ID

## 示例
### 一、根据区域编码获取地区信息
```js
import { areaInfoByCode } from 'weather-station-system';
// 区域编号
const code = '350211';
const result = areaInfoByCode(code);
console.log(result);
```
#### 返回数据
- type: 编码类型（省份、城市、区县）
```json
{
  "name": "福建省-厦门市-集美区",
  "type": "区县",
  "detail": {
    "province": {
      "code": "350000",
      "name": "福建省"
    },
    "city": {
      "code": "350200",
      "name": "厦门市"
    },
    "area": {
      "code": "350211",
      "name": "集美区"
    }
  }
}
```
### 二、根据区域编码获取气象站信息
```js
import { stationByCode } from 'weather-station-system';
// 区域编号
const code = '350211';
const result = stationByCode(code);
console.log(result);
```
#### 返回数据
```json
{
  "name": "福建省-厦门市-集美区",
  "type": "区县",
  "detail": {
    "province": {
      "code": "350000",
      "name": "福建省"
    },
    "city": {
      "code": "350200",
      "name": "厦门市"
    },
    "area": {
      "code": "350211",
      "name": "集美区"
    }
  },
  "station": {
    "lng": 118.100869,
    "adcode": "350211",
    "csid": 59134,
    "hcode": "CN101230206",
    "lat": 24.572874,
    "sid": 71919
  }
}
```
### 二、根据区域编码获取历史气象数据(需要联网)
接口可获取本月全部的历史数据，根据业务需求自行过滤需要的数据项。
```js
import { stationMonthDataByCode } from 'weather-station-system';
// 区域编号
const code = '350211';
// 日期
const date = '202502';
// 有异步请求，需要等待请求响应
const result = await stationMonthDataByCode(code, date);
console.log(result);
```
#### 返回数据
月份为个位数时需要补零，如2025年2月，则参数为202502。

天气参数说明：
- ymd: 年月日,
- bWendu: 最高温度,
- yWendu: 最低温度,
- tianqi: 天气,
- fengxiang: 风向,
- fengli: 风力,
- aqi: 空气质量指数,
- aqiInfo: 空气质量指数说明,
- aqiLevel: 空气质量指数等级
```json
{
  "name": "福建省-厦门市-集美区",
  "type": "区县",
  "detail": {
    "province": {
      "code": "350000",
      "name": "福建省"
    },
    "city": {
      "code": "350200",
      "name": "厦门市"
    },
    "area": {
      "code": "350211",
      "name": "集美区"
    }
  },
  "station": {
    "lng": 118.100869,
    "adcode": "350211",
    "csid": 59134,
    "hcode": "CN101230206",
    "lat": 24.572874,
    "sid": 71919
  },
  "weatherInfo": [
    {
      "ymd": "2022-02-01",
      "bWendu": "12℃",
      "yWendu": "10℃",
      "tianqi": "大雨~小雨",
      "fengxiang": "东北风",
      "fengli": "3级",
      "aqi": "28",
      "aqiInfo": "优",
      "aqiLevel": "1"
    }
  ]
}
```
## 拓展
如因服务器问题，导致气象历史数据访问异常，可自行接入其他数据源，气象站的数据是通用的。
- [中国气象数据网](https://data.cma.cn/)
- [环境气象数据服务平台](http://eia-data.com/weather_api/)