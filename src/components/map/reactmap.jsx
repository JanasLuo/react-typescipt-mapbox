import React, { Compnents } from 'react'
import { observer, inject } from 'mobx-react'
import { observable } from 'mobx'
import MapGL, { SVGOverlay, FlyToInterpolator } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
// import 'mapbox-gl/dist/mapbox-gl.css'
import moment from 'moment'
// import MapTab from './mapTab.tsx'
// import MapControl from './map_control'
import Bus from 'src/utils/eventBus.ts'
import { formartGeo, parseWkt } from 'src/utils/map_layer/format.js'

class ReactMap extends React.Component {
  constructor(props) {
    super(props)
    this.colorNum = 100
    this.colorAdd = true
    this.animation = null // 动画
    this.isShowMapTab = observable.box(false)
  }
  // 显示隐藏地图风格切换面板
  toggleMapTab = () => {
    this.isShowMapTab.set(!this.isShowMapTab.get())
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
      let num = parseInt(time / 87.6, 10)
      mapStore.setMarks(num)
      mapStore.hotMapOpen()
    }, stateTime)
    mapStore.setTimeOut(timeOut)
  }
  //设置全局的时间
  setTime = () => {
    let mapStore = this.props.mapStore
    mapStore.setTimeFun(this.timeOut.bind(this))
  }
  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this))
    this._resize()
    this.setTime()
  }
  drawMapBoundary = map => {
    let mapBoundary = this.props.userStore.getUserProfile.map_boundary
    if (!mapBoundary) {
      return
    }
    let newMapBoundary = mapBoundary.replace(/\+/g, ' ')
    let coor = formartGeo(newMapBoundary)
    let geometry = parseWkt(newMapBoundary)
    // const data = JSON.parse(localStorage.getItem('jianganluwang'))
    // console.log('data', data)
    map.addLayer({
      id: 'reactMapBoundary',
      type: 'line',
      source: {
        type: 'geojson',
        // data
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
          localStorage.getItem('mapTheme') === 'darkblue' ? '#ccc' : '#333',
        'line-width': 8,
        'line-blur': 4,
        'line-opacity': 1 /* 透明度 */
      }
    })
    this.animateBoundary()
  }
  // 边界线动画
  animateBoundary() {
    if (this.animation) {
      cancelAnimationFrame(this.animation)
    }
    const mapStore = this.props.mapStore
    // console.log('mapStore.mapReactObj', mapStore.mapReactObj)
    if (this.colorNum >= 255) {
      this.colorAdd = false
    }
    if (this.colorNum <= 100) {
      this.colorAdd = true
    }
    this.colorNum = this.colorNum + (this.colorAdd ? 2 : -2)
    mapStore.mapReactObj.setPaintProperty(
      'reactMapBoundary',
      'line-color',
      `rgb(${this.colorNum}, ${this.colorNum}, 0)`
    )
    this.animation = requestAnimationFrame(this.animateBoundary.bind(this))
  }
  changedMapTheme = mapTheme => {
    const mapStore = this.props.mapStore
    mapStore.mapReactObj && this.drawMapBoundary(mapStore.mapReactObj)
  }
  initMapInfo = map => {
    let mapStore = this.props.mapStore
    mapStore.curBounds = map.getBounds()
    mapStore.curCenter = map.getCenter()
    mapStore.curZoom = map.getZoom()
    console.log('mapStore', mapStore)
  }
  /* 地图加载完成 */
  onLoadMapSource = e => {
    console.log('onLoadMapSource map', e.target)
    const mapStore = this.props.mapStore
    const map = e.target
    this.initMapInfo(map)
    const center = mapStore.getCenter()
    mapStore.setMapReactObj(map)
    // this.drawMapBoundary(map)
    mapStore.isReactMapload = true
    // 缩放控件
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')
    // 全屏控件
    // map.addControl(new mapboxgl.FullscreenControl())
    Bus.emit('reactMapLoad')
    // map.on('zoomend', () => {
    //   console.log('emit zoomend')
    //   Bus.emit('zoomend', map)
    // })
    map.on('moveend', () => {
      console.log('emit moveend')
      Bus.emit('moveend', map)
    })
    console.log('emit reactMapLoad')
  }
  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight - 77
    })
  }
  componentWillUnmount() {
    const mapStore = this.props.mapStore
    if (this.animation) {
      cancelAnimationFrame(this.animation)
    }
    mapStore.isReactMapload = false
    // mapStore.setMapReactObj(null)
  }

  _onViewportChange(viewport) {
    this.props.mapStore.changeViewport(viewport)
  }
  _removeMissingdivCss = () => {
    const missingdiv = document.querySelector('.mapboxgl-missing-css')
    if (missingdiv) missingdiv.style.display = 'none'
  }

  /* 全屏切换 */
  requestFullScreen = () => {
    // this.props.mapStore.requestFullScreen(document.getElementById('smartShow'))
    this.props.mapStore.requestFullScreen()
  }
  /* 地图图层初始化 */
  initLayer = () => {
    this.props.mapStore.changeViewport({
      zoom: 12
    })
    this.props.initLayer()
  }
  render() {
    const { viewport, mapstate, accessToken, mapReactObj } = this.props.mapStore
    return (
      <div className="react-map mapbox-container" id="reactMap">
        <MapGL
          {...viewport}
          mapStyle={mapstate.style}
          onViewportChange={this._onViewportChange.bind(this)} //  用户与地图交互时触发的回调。传递给回调对象包含视口性能如 longitude，latitude，zoom等。
          mapboxApiAccessToken={accessToken}
          onLoad={this.onLoadMapSource}
          removeMissingdivCss={this._removeMissingdivCss()}
        >
          {this.props.children}
        </MapGL>
        {/* {mapReactObj && (
          <MapTab
            map={mapReactObj}
            onChangedMapTheme={this.changedMapTheme}
            isShow={this.isShowMapTab.get()}
          />
        )} */}
        {/* <MapControl
          isShowMapTab={this.isShowMapTab.get()}
          requestFullScreen={this.requestFullScreen}
          initLayer={this.initLayer}
          toggleMapTab={this.toggleMapTab}
        ></MapControl> */}
      </div>
    )
  }
}

export default inject('mapStore', 'userStore')(observer(ReactMap))
