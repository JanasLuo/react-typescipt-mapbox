import { action, observable } from 'mobx'
import Bean from 'src/beans'
import Util from 'src/utils'

export class MapStore {
  @observable public mapObj: any = null
  @observable public mapReactObj: any = null
  @observable public mapstate: any
  @observable public drawObj: any
  @observable public timeState: boolean = false
  @observable public timeShowState: boolean = false
  @observable public timeOut: any
  @observable public timeFun: any
  @observable public marks: number = 0
  @observable public time: number = 0
  @observable public stateTime: number = 100
  @observable public endTime: number = 8760
  @observable public hotMap: any
  @observable public pavementMap: any
  @observable public sectionMap: any
  @observable public sectionHotMap: any
  @observable public intersectionMap: any
  @observable public intersectionHotMap: any
  @observable public viewport: any
  @observable public accessToken: string
  @observable public specialMapObj: any
  @observable public mapTheme: string
  @observable public isload: boolean = false
  @observable public isReactMapload: boolean = false
  public dackData: any
  @observable public dackList: any[] = []
  @observable public deck: boolean = false
  @observable public lowerPercentile: number = 0
  @observable public upperPercentile: number = 100
  @observable public hexagonDatas: any[] = []
  @observable public isHexagonActive: boolean = false
  @observable public hexagonActivePointLength: number = 0
  @observable public fullScreen: boolean = false
  @observable public animation: any //  边界线动画AnimationFrame
  @observable public specialHoveredStateId: any //  边界线动画AnimationFrame
  public hoveredStateId: any
  // 态势分析
  @observable public category: string = '案件'
  @observable public type: string = ''
  @observable public groupId: string = ''
  @observable public parentGroupId: string = ''
  @observable public tabKey: string = '1'
  @observable public colorDomain: any[] = []
  @observable public overviewDeptName: string = ''
  @observable public isFlag: boolean = true

  public curBounds: any // 当前地图的可视区域
  public curCenter: any // 拖拽后地图的中心点
  public curZoom: number // 缩放后地图的zoom

  constructor() {
    this.mapstate = {
      container: 'map',
      // style: Bean.ISERVER_LAYER_PATH,
      style: {
        version: 8,
        glyphs: '/font/{fontstack}/{range}.pbf',
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['/darkblue/tiles/{z}/{x}/{y}.png'],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 9,
            maxzoom: 18
          }
        ]
      },
      // attributionControl: false,
      zoom: 9.285782070032383,
      center: null,
      maxZoom: 17, // 实际可见到18级
      minZoom: 9
    }
    this.viewport = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      longitude: 0,
      latitude: 0,
      zoom: 12,
      minZoom: 9.285782070032383,
      maxZoom: 17 // 实际可见到18级
      // pitch: 0,
      // pitchWithRotate: false,
      // scrollZoom: false,
      // boxZoom: false,
      // dragRotate: false,
      // dragPan: false,
      // doubleClickZoom: false,
      // keyboard: false,
      // touchZoomRotate: false,
      // touchPitch: false,
      // trackResize: false
    }
    this.accessToken =
      'pk.eyJ1IjoiamFuYXNsdW8iLCJhIjoiY2p6d2R0dnQxMGw1OTNjcWltdzg5NzRzeCJ9.OQx44V543mOsS8RerbiIdQ'
  }

  public getMapObj() {
    return this.mapObj
  }
  public getMapstate() {
    return this.mapstate
  }
  @action public setColorDomain(colorDomain: any) {
    this.colorDomain = colorDomain
  }
  @action public setMarks(marks: number) {
    return (this.marks = marks)
  }
  @action public setTime(time: number) {
    return (this.time = time)
  }
  @action public setMapObj(mapObj: any) {
    return (this.mapObj = mapObj)
  }
  @action public setMapReactObj(mapReactObj: any) {
    return (this.mapReactObj = mapReactObj)
  }
  @action public changeViewport(viewport: any) {
    this.viewport = {
      ...this.viewport,
      ...viewport
    }
  }
  @action public setDrawObj(drawObj: any) {
    return (this.drawObj = drawObj)
  }
  @action public setMapstate(mapstate: any) {
    return (this.mapstate = {
      ...this.mapstate,
      ...mapstate
    })
  }
  @action public setTimeState(timeState: boolean) {
    return (this.timeState = timeState)
  }
  @action public setTimeShowState(timeShowState: boolean) {
    return (this.timeShowState = timeShowState)
  }
  @action public setTimeOut(timeOut: any) {
    return (this.timeOut = timeOut)
  }
  @action public setTimeFun(timeFun: any) {
    return (this.timeFun = timeFun)
  }
  @action public setSpecialHoveredStateId(id: any) {
    this.specialHoveredStateId = id
  }
  @action public setTimeOpen() {
    this.timeFun()
    this.timeShowState = true
  }
  @action public shutTimeOpen() {
    if (this.timeOut) {
      clearInterval(this.timeOut)
      this.timeOut = ''
      this.timeState = false
    }
  }
  @action public hotMapOpen() {
    if (this.hotMap) {
      this.hotMap(this.time)
    }
  }
  @action public pavementMapOpen() {
    if (this.pavementMap) {
      this.pavementMap(this.time)
    }
  }
  @action public intersectionMapOpen() {
    if (this.intersectionMap) {
      this.intersectionMap(this.time)
    }
  }
  @action public sectionMapOpen() {
    if (this.sectionMap) {
      this.sectionMap(this.time)
    }
  }
  @action public setHotMap(hotMap: any) {
    this.hotMap = hotMap
  }
  @action public setPavementMap(pavementMap: any) {
    this.pavementMap = pavementMap
  }
  @action public setSectionMap(sectionMap: any) {
    this.sectionMap = sectionMap
  }
  @action public setSectionHotMap(sectionHotMap: any) {
    this.sectionHotMap = sectionHotMap
  }
  @action public setIntersectionMap(intersectionMap: any) {
    this.intersectionMap = intersectionMap
  }
  @action public setIntersectionHotMap(intersectionHotMap: any) {
    this.intersectionHotMap = intersectionHotMap
  }
  @action public setDackData(dackData: any) {
    this.dackData = dackData
  }
  @action public setDackList(dackList: any) {
    this.dackList = dackList
  }
  @action public setDeck(deck: boolean) {
    this.deck = deck
  }
  @action public setHexagonDatas(hexagonDatas: any[]) {
    this.hexagonDatas = hexagonDatas
  }
  @action public async setSpecialMapObj(specialMapObj: any) {
    this.specialMapObj = specialMapObj
  }
  @action public async setMapTheme(mapTheme: string, tileUrl: string) {
    this.mapTheme = mapTheme
    localStorage.setItem('mapTheme', mapTheme)
    this.mapstate.style.sources['raster-tiles'].tiles[0] = tileUrl
  }
  @action public async getMapTheme() {
    if (this.mapTheme) {
      return this.mapTheme
    }
    return localStorage.getItem('mapTheme')
  }
  @action public async getCenter() {
    // if (this.mapstate.center) {
    //   return this.mapstate.center
    // } else {
    //   let userProfile
    //   try {
    //     userProfile = JSON.parse(
    //       window.localStorage.getItem('profile') as string
    //     )
    //   } catch (e) {
    //     console.log(e)
    //   }
    const center = Bean.CENTER
    return center
    // }
  }
  @action public async getZoom() {
    if (this.mapstate.zoom) {
      return this.mapstate.zoom
    } else {
      let userProfile
      try {
        userProfile = JSON.parse(
          window.localStorage.getItem('profile') as string
        )
      } catch (e) {
        console.log(e)
      }
      return userProfile.config ? userProfile.config.map_zoom : Bean.ZOOM
    }
  }
  @action public setFullScreen(fullScreen: boolean) {
    return (this.fullScreen = fullScreen)
  }
  @action public isFullScreen() {
    const document: any = window.document
    return !!(
      document.fullscreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      document.webkitFullScreen ||
      document.msFullScreen
    )
  }
  @action public requestFullScreen(
    element: any = window.document.documentElement
  ) {
    Util.requestFullScreen(element)
    this.setFullScreen(!this.fullScreen)
  }
  public mousemoveHandle = (mapObj: any, states: any, e: any) => {
    const features = e.features
    if (features && features.length > 0) {
      if (this.hoveredStateId) {
        mapObj.setFeatureState(
          { source: states, id: this.hoveredStateId },
          { hover: false }
        )
      }
      this.hoveredStateId = features[0].id
      mapObj.setFeatureState(
        { source: states, id: this.hoveredStateId },
        { hover: true }
      )
    }
  }
  public mouseleaveHandle = (mapObj: any, states: any) => {
    if (this.hoveredStateId) {
      mapObj.setFeatureState(
        { source: states, id: this.hoveredStateId },
        { hover: false }
      )
    }
    this.hoveredStateId = null
  }
  /* 缩放结束 */
  public zoomendHandler = (map: any, cb: () => void, number1 = 1) => {
    const zoomChange = Math.abs(map.getZoom() - this.curZoom)
    if (zoomChange > number1) {
      this.curZoom = map.getZoom()
      this.curBounds = map.getBounds()
      cb()
    }
  }
  /* 拖拽结束 */
  public dragendHandler = (map: any, cb: () => void) => {
    const curCenter = this.curCenter
    const center = map.getCenter()
    const latChange = Math.abs(curCenter.lat - center.lat)
    const lngChange = Math.abs(curCenter.lng - center.lng)
    if (latChange > 0.01 || lngChange > 0.01) {
      this.curCenter = center
      this.curBounds = map.getBounds()
      cb()
    }
  }
  /* 拖拽结束 */
  public moveendHandler = (map: any, cb: () => void) => {
    const curCenter = this.curCenter
    const center = map.getCenter()
    const latChange = Math.abs(curCenter.lat - center.lat)
    const lngChange = Math.abs(curCenter.lng - center.lng)
    if (latChange > 0.01 || lngChange > 0.01) {
      this.curCenter = center
      this.curBounds = map.getBounds()
    }
    const zoomChange = Math.abs(map.getZoom() - this.curZoom)
    if (zoomChange > 1) {
      this.curZoom = map.getZoom()
      this.curBounds = map.getBounds()
    }
    if (latChange > 0.01 || lngChange > 0.01 || zoomChange > 1) {
      cb()
    }
  }
}

export default new MapStore()
