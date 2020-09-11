import React from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Radio } from 'antd'
import mapboxgl from 'mapbox-gl'
// import 'mapbox-gl/dist/mapbox-gl.css'
import 'mapbox-gl/src/css/mapbox-gl.css'
import Draw from 'mapbox-gl-draw'
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css'
import moment from 'moment'
// import MapControl from './map_control'
// import SpecialMap from 'src/utils/map_layer/special_map.js'
// import MapTab from './mapTab.tsx'
import { formartGeo, parseWkt } from 'src/utils/map_layer/format.js'
// import turf from 'turf'
// import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import Bus from 'src/utils/eventBus.ts'
import Bean from 'src/beans'
// import light1 from 'src/assets/boundary-light1.svg'
// import light2 from 'src/assets/boundary-light2.svg'
// import light3 from 'src/assets/boundary-light3.svg'
class Mapbox extends React.Component {
  constructor(props) {
    super(props)
    this.colorNum = 100
    this.colorAdd = true
    this.animation = null
    this.imgSize = {
      bondaryLightImg1: 0.1,
      bondaryLightImg2: 0.1,
      bondaryLightImg3: 0.1
    }
    this.lightEnlarge = {
      bondaryLightImg1: true,
      bondaryLightImg2: true,
      bondaryLightImg3: true
    }
    this.isShowMapTab = observable.box(false)
  }
  //初次渲染
  componentDidMount() {
    console.log('mapbox componentDidMount')
    let mapStore = this.props.mapStore
    // 清除边界线动画

    // cancelAnimationFrame(mapStore.animation)
    mapboxgl.accessToken = mapStore.accessToken
    // mapStore.pitch
    console.log(mapStore, 'mapstroe', mapStore.mapstate)
    mapStore.mapstate.center = Bean.CENTER
    // mapStore.mapstate.pitch = 45
    const f = {
      minZoom: 8,
      zoom: 10,
      dragPan: false,
      pitch: 0
    }
    let map = new mapboxgl.Map({
      ...mapStore.mapstate,
      ...f
    })
    mapStore.setMapObj(map)

    this.setTime()
    // 缩放控件
    // map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    // // 地图全屏的插件
    // map.addControl(new mapboxgl.FullscreenControl())
    let draw = new Draw()
    map.addControl(draw, 'top-right')
    mapStore.setDrawObj(draw)
    //地图初始化的时候进行图层判断加载删除

    map.on('load', () => {
      console.log('mapbox mapLoad')
      this.initMapInfo(map)
      if (this.props.isMapFullScreen) {
        map.addControl(new mapboxgl.FullscreenControl())
      }
      mapStore.isload = true
      Bus.emit('mapLoad', map)
      // this.drawMapBoundary(map)
      // const profile = this.props.userStore.getUserProfile
      const center = Bean.CENTER
      // const config = profile.config
      const zoom = 7
    })
    map.on('zoomend', () => {
      Bus.emit('zoomend', map)
    })
    map.on('dragend', () => {
      Bus.emit('dragend', map)
    })
    this.removeMissingdivCss()
  }
  /* 计算Point是否在Polygon内 */
  testPointInPolygon() {
    var pt = turf.point([-88, 44])
    var poly = turf.polygon([
      [
        [-81, 41],
        [-81, 47],
        [-72, 47],
        [-72, 41],
        [-81, 41]
      ]
    ])
    console.log('booleanPointInPolygon', booleanPointInPolygon(pt, poly))
  }
  //二次渲染
  componentDidUpdate() {
    let mapStore = this.props.mapStore
    setTimeout(() => {
      if (mapStore.mapObj) {
        mapStore.mapObj.resize()
      }
    }, 185)
  }
  componentWillUnmount() {
    console.log('mapbox componentWillUnmount')
    // cancelAnimationFrame(this.props.mapStore.animation)
  }

  /**
   * 初始化map当前 zoom、center、bound信息
   *
   * @memberof Mapbox
   */
  initMapInfo = (map) => {
    let mapStore = this.props.mapStore
    mapStore.curBounds = map.getBounds()
    mapStore.curCenter = map.getCenter()
    mapStore.curZoom = map.getZoom()
    console.log('mapStore', mapStore)
  }
  // 显示隐藏地图风格切换面板
  toggleMapTab = () => {
    this.isShowMapTab.set(!this.isShowMapTab.get())
  }
  drawMapBoundary = (map) => {
    let mapBoundary = this.props.userStore.getUserProfile.map_boundary
    if (!mapBoundary) {
      return
    }
    let newMapBoundary = mapBoundary.replace(/\+/g, ' ')
    let coor = formartGeo(newMapBoundary)
    let geometry = parseWkt(newMapBoundary)
    // const data = JSON.parse(localStorage.getItem('luwang'))
    // console.log('data', data)
    map.addLayer({
      id: 'mapBoundary',
      type: 'line',
      source: {
        type: 'geojson',
        // data: data
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: geometry
            }
          ]
        }
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color':
          localStorage.getItem('mapTheme') == 'darkblue' ? '#ccc' : '#333',
        'line-width': 8,
        'line-blur': 4,
        'line-opacity': 1 /* 透明度 */
      }
    })
    // this.drawBoundaryLight()
    this.animateBoundary()
  }
  /* 绘制边界线光影 */
  // drawBoundaryLight() {
  //   let mapBoundary = this.props.userStore.getUserProfile.map_boundary
  //   if (!mapBoundary) {
  //     return
  //   }
  //   const boundaryPoints = formartGeo(mapBoundary)
  //   // console.log('boundaryPoint', boundaryPoints)
  //   let arr1 = []
  //   let arr2 = []
  //   let arr3 = []

  //   for (let i = 0; i < boundaryPoints.length; i++) {
  //     let features = {
  //       type: 'Feature',
  //       geometry: {
  //         type: 'Point',
  //         coordinates: boundaryPoints[i]
  //       }
  //     }
  //     const num = i % 5
  //     switch (num) {
  //       case 0:
  //         arr1.push(features)
  //         break
  //       case 1:
  //         arr2.push(features)
  //         break
  //       case 2:
  //         arr3.push(features)
  //         break
  //       case 3:
  //         arr1.push(features)
  //         break
  //       case 4:
  //         arr2.push(features)
  //         break
  //     }
  //   }

  //   this.addBondaryLightImg(arr1, light1, 'bondaryLightImg1')
  //   this.addBondaryLightImg(arr2, light2, 'bondaryLightImg2')
  //   this.addBondaryLightImg(arr3, light3, 'bondaryLightImg3')
  // }
  addBondaryLightImg(arr, light, id) {
    const mapStore = this.props.mapStore
    const img = new Image()
    img.src = light
    img.onload = () => {
      mapStore.mapObj.addSource(id, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: arr
        }
      })
      mapStore.mapObj.addImage(id, img)
      mapStore.mapObj.addLayer({
        id: id,
        type: 'symbol',
        source: id,
        layout: {
          'icon-image': id,
          'icon-size': 0.5,
          'icon-allow-overlap': true,
          'icon-anchor': 'bottom'
        },
        paint: {
          'icon-opacity': 1
        }
      })
      this.animateLight(0, id)
    }
  }
  // 边界线动画
  animateBoundary() {
    const mapStore = this.props.mapStore
    // if (this.mapStore.animation) {
    //   cancelAnimationFrame(this.mapStore.animation)
    // }
    // cancelAnimationFrame(mapStore.animation)
    // console.log('animateBoundary this.mapObj', mapStore.mapObj)
    if (this.colorNum >= 255) {
      this.colorAdd = false
    }
    if (this.colorNum <= 100) {
      this.colorAdd = true
    }
    this.colorNum = this.colorNum + (this.colorAdd ? 2 : -2)
    mapStore.mapObj.setPaintProperty(
      'mapBoundary',
      'line-color',
      `rgb(${this.colorNum}, ${this.colorNum}, 0)`
    )
    mapStore.animation = requestAnimationFrame(this.animateBoundary.bind(this))
  }
  // 边界线光影图片动画
  animateLight(time, id) {
    const mapStore = this.props.mapStore
    if (!id) {
      return
    }
    if (this.imgSize[id] >= 0.5) {
      this.lightEnlarge[id] = false
    }
    if (this.imgSize[id] <= 0.1) {
      this.lightEnlarge[id] = true
    }
    this.imgSize[id] =
      this.imgSize[id] + (this.lightEnlarge[id] ? 0.005 : -0.005)
    let imgOpacity = this.imgSize[id] * 2
    imgOpacity = imgOpacity > 1 ? 1 : imgOpacity
    mapStore.mapObj.setLayoutProperty(id, 'icon-size', this.imgSize[id])
    mapStore.mapObj.setPaintProperty(id, 'icon-opacity', imgOpacity)
    requestAnimationFrame(this.animateLight.bind(this, time, id))
  }
  //全局的定时器
  timeOut = () => {
    let mapStore = this.props.mapStore
    let stateTime = mapStore.stateTime
    let endTime = mapStore.endTime
    let timeOut = setInterval(() => {
      let time = mapStore.time
      if (time < endTime) {
        time += 24
      } else {
        time = 0
      }
      mapStore.setTime(time)
      let num = parseInt(time / 87.6)
      mapStore.setMarks(num)
      mapStore.hotMapOpen()
      mapStore.pavementMapOpen()
      mapStore.sectionMapOpen()
      mapStore.intersectionMapOpen()
    }, stateTime)
    mapStore.setTimeOut(timeOut)
  }
  //设置全局的时间
  setTime = () => {
    let mapStore = this.props.mapStore
    mapStore.setTimeFun(this.timeOut.bind(this))
  }
  //隐藏CSS
  removeMissingdivCss = () => {
    const missingdiv = document.querySelector('.mapboxgl-missing-css')
    if (missingdiv) missingdiv.style.display = 'none'
    const mapDOM = document.querySelector('.mapboxgl-ctrl-logo')
    if (mapDOM) mapDOM.style.display = 'none'
    const draw = document.querySelector('.mapboxgl-ctrl')
    if (draw) draw.style.display = 'none'
  }
  changedMapTheme = (mapTheme) => {
    const mapStore = this.props.mapStore
    mapStore.mapObj && this.drawMapBoundary(mapStore.mapObj)
  }
  /* 全屏切换 */
  requestFullScreen = () => {
    // this.props.mapStore.requestFullScreen(document.getElementById('smartShow'))
    this.props.mapStore.requestFullScreen()
  }
  /* 地图图层初始化 */
  initLayer = () => {
    // this.props.mapStore.changeViewport({
    //   zoom: 12
    // })
    this.props.initLayer && this.props.initLayer()
  }
  render() {
    const mapStore = this.props.mapStore
    const userProfile = this.props.userStore.getUserProfile || {}
    const mapThemeMap = userProfile.config ? userProfile.config.map_theme : {}
    return (
      <div className="mapbox-container">
        <div id="map" className="mapbox"></div>
        {/* <div className="map-theme">
          {
            Object.keys(mapThemeMap).length &&
            <Radio.Group value={mapStore.mapTheme} buttonStyle="solid" size="small" onChange={(e) => this.changedMapTheme(e.target.value)}>
              {Object.keys(mapThemeMap).map(item => (
                <Radio.Button key={item} value={item}>{mapThemeMap[item].cn_name}</Radio.Button>
              ))}
            </Radio.Group>
          }
        </div> */}
        {/* {!this.props.isHidewMapTab && mapStore.mapObj && (
          <MapTab
            map={mapStore.mapObj}
            onChangedMapTheme={this.changedMapTheme}
            isShow={this.isShowMapTab.get()}
          />
        )} */}
        {/* {!this.props.isHidewMapControl && (
          <MapControl
            requestFullScreen={this.requestFullScreen}
            initLayer={this.initLayer}
            toggleMapTab={this.toggleMapTab}
          ></MapControl>
        )} */}
      </div>
    )
  }
}

export default inject('mapStore', 'userStore')(observer(Mapbox))
