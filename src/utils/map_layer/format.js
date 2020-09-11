import GeoUtil from './geo_util.js'
import mapStore from 'src/stores/modules/map'
import Beans from 'src/beans'
import wkt from 'terraformer-wkt-parser'

/* 根据每个元素案件数量 划分颜色区域 */
export function caculateColorDomain(data, value, name) {
  let num = [];
  for (let i in data) {
    num.push(data[i][name] || 1);
  }
  console.log(num, 'num', data)
  num.sort((a, b) => a - b)
  if (value == 2) { //  分位数分段
    // console.log('分位数分段')
    let length = num.length;
    length = length / 4;
    num = [[num[0], num[parseInt(length)]], [num[parseInt(length)] + 1, num[parseInt(2 * length)]], [num[parseInt(2 * length)] + 1, num[parseInt(3 * length)]], [num[parseInt(3 * length)] + 1, num[parseInt(4 * length)]]]
  } else { //  均值分段
    // console.log('均值分段')
    let s = num[0];
    num = num[num.length - 1] - num[0];
    num = num / 4;
    num = [[s, s + num], [s + num + 1, s + num * 2], [s + num * 2 + 1, s + num * 3], [s + num * 3 + 1, s + num * 4]];
  }
  let colorDomain = []
  if (data.length >= 5) {
    colorDomain = [parseInt(num[0][0]), parseInt(num[0][1]), parseInt(num[1][1]), parseInt(num[2][1])]
  } else {
    const arr = data.map(item => item[name]).sort()
    colorDomain = [...new Set(arr)]
  }
  if (colorDomain[0] > 1) {
    colorDomain.unshift(1)
  }
  mapStore.setColorDomain(colorDomain)
  return num
}
export function formartFeaturesByDate(data, value, geoType) {
  console.log('data', value, data)
  // console.log('formartFeaturesByDate')
  let features = {
    type: "FeatureCollection",
    features: []
  }
  // debugger
  // let color = ["#038E3E", "#24FF00", "#FFFF00", "#FF7800", "#FF0000"] 
  let color = Beans.COLOR_RANGE
  // console.log('num2')
  let num = caculateColorDomain(data, value, 'num')
  // console.log('num', num)
  for (let z in data) {
    let o = 0;

    let geometry = formartGeometry(data[z], geoType)
    // console.log(geometry, 'geometry')
    if (geometry) {
      let coor = geometry.coordinates
      let type = geoType || geometry.type
      let center = type == 'Point' ? coor : type == 'LineString' ? getCenter(coor) : type == 'MultiPolygon' ? getCenter(coor[0][0]) : getCenter(coor[0])
      let obj = {
        'type': 'Feature',
        id: data[z].id || data[z].policeNum,
        'properties': {
          ID: data[z].smid || data[z].id || data[z].group_id || data[z].policeNum,
          group_id: data[z].group_id,
          name: data[z].name,
          num: data[z].num || 0,
          text: data[z].name + '\n' + (data[z].num > 0 ? `(${data[z].num})` : ``),
          color: color[o],
          center: center,
          centerPoint: data[z].centroid ? formartGeo(data[z].centroid) : [],
          smx: center[0],
          smy: center[1],
          geometry: geometry,
          drill: data[z].drill,
          level: data[z].level
        },
        'count': parseInt(data[z].num || 0),
        'geometry': {
          ...geometry,
          _coordinates: geometry.coordinates,
        }
      }
      features.features.push(obj);
    }
  }
  return features
}
export function formartGeometry(data, geoType) {
  if (geoType == 'Point' && data.smx) {
    return {
      type: geoType,
      coordinates: transformGeo([data.smx, data.smy])
    }
  }
  if (data.geometry || data.coordinate || data.geo) {
    return parseWkt(data.geometry || data.coordinate || data.geo, geoType)
  }
}

/* 不同配置下坐标转换方案 */
export function transformGeo(point) {
  const thirdPartyBool = localStorage.getItem('third_party_bool')
  if (thirdPartyBool === 'true') {
    return point
  } else {
    // ligth和darkblue均为Wgs84地图
    return localStorage.getItem('map_transform_geo') === 'true' ? geoGcj02ToWgs84(point) : point
  }
}
export function geoWgs84ToGcj02(data) {
  var p = GeoUtil.transform({ lat: Number(data[1]), lng: Number(data[0]) }, "wgs84", "gcj02");
  return [p.lng, p.lat]
}
export function geoGcj02ToWgs84(data) {
  var p = GeoUtil.transform({ lat: Number(data[1]), lng: Number(data[0]) }, "gcj02", "wgs84");
  return [p.lng, p.lat]
}
/* 利用工具转换wkt 
  {
    coordinates: [],
    type: "Polygon"
  }
*/
export function parseWkt(str) {
  const geometry = wkt.parse(str);
  const type = geometry.type
  switch (type) {
    case 'Point':
      geometry.coordinates = transformGeo(geometry.coordinates);
      break;
    case 'LineString':
      geometry.coordinates = geometry.coordinates.map(item => transformGeo(item));
      break;
    case 'Polygon':
      geometry.coordinates[0] = geometry.coordinates[0].map(item => transformGeo(item));
      break;
    case 'MultiPoint':
      geometry.coordinates = geometry.coordinates.map(item => transformGeo(item));
      break;
    case 'MultiLineString':
      geometry.coordinates = geometry.coordinates.map(item => item.map(i => transformGeo(i)))
      break;
    case 'MultiPolygon':
      geometry.coordinates = geometry.coordinates.map(item => item.map(i => i.map(j => transformGeo(j))))
      break
  }
  return geometry
}
export function formartGeo(str) {
  if (str) {
    const geometry = parseWkt(str)
    return geometry && geometry.coordinates || []
  }
}

export function getCenter(zb) {
  let x = 0
  let y = 0
  zb.forEach((item) => {
    x += item[0]
    y += item[1]
  })
  let centerx = x / zb.length
  let centery = y / zb.length

  return transformGeo([centerx, centery])
}
