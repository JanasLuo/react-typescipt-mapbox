import mapboxgl from 'mapbox-gl'
import Bean from 'src/beans'
import {
  formartFeaturesByDate,
  getCenter
} from './format'
import mapStore from 'src/stores/modules/map'
import Bus from 'src/utils/eventBus'
class SpecialMap {
  constructor(map, data) {
    this.map = map;
    this.data = null;
    this.addMapLay = this.addMapLay.bind(this);
    this.removeMapLay = this.removeMapLay.bind(this);
    this.dataUrl = Bean.ISERVER_BASE_PATH;
    this.index = 0
  }
  randomAnchor() {
    const w = this.index % 2
    this.index++
    // console.log(w, this.index)
    if (w === 0) {
      return 'top-left'
    } else {
      return 'bottom-right'
    }

  }
  addMapLay(data, value, haveName = true, suf = '', boderColor = 2) {
    this.removeMapLay(suf)
    const map = this.map
    const color =
      localStorage.getItem('mapTheme') === 'darkblue' ? '#fcf9f2' : '#000'
    let features = formartFeaturesByDate(data, value, 'Polygon')

    this.map.addSource('SpecialStates' + suf, {
      type: 'geojson',
      data: features
      // data: featuresData
    });


    this.map.addLayer({
      "id": 'SpecialMap' + suf,
      "type": "fill",
      "source": 'SpecialStates' + suf,
      "paint": {
        // "fill-outline-color": color,
        // "fill-color": {
        //   'type': 'identity',
        //   'property': 'color' // 根据属性值动态设置
        // },
        // "fill-color": 'rgba(36, 121, 255,.6)',

        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(235,196,0,.24)',
          'rgba(91, 219, 255, 0.24)'
        ]
      }
    });
    let linecolor = 'rgba(1,41,44,1)'
    if (boderColor === 2) {
      linecolor = 'rgba(91, 219, 255, 0.94)'
    }
    this.map.addLayer({
      id: 'SpecialBorder' + suf,
      type: 'line',
      source: 'SpecialStates' + suf,
      layout: {},
      paint: {
        // 'line-color': linecolor,
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'rgba(235,196,0,1)',
          linecolor
        ],
        'line-width': 4
      }
    });
    // console.log(features, 'features')
    let textAllowOverlap = false
    if (this.map.getZoom() > 16) {
      textAllowOverlap = true
    }
    if (haveName) {
      this.map.addLayer({
        id: "count" + suf,
        type: "symbol",
        source: {
          "type": "geojson",
          "data": features
          // "data": featuresData
        },
        layout: {
          'text-allow-overlap': textAllowOverlap,
          "text-field": "{name}",
          "text-font": ["Microsoft YaHei Regular"],
          "text-size": 12,
          // 'visibility': textVisible
        },
        paint: {
          "text-color": localStorage.getItem('mapTheme') == 'darkblue' ? "#59D3DC" : "#59D3DC"
        }
      })
    }

    map.on('mousemove', 'SpecialMap' + suf, function (e) {
      if (e.features.length > 0) {

        const nowid = e.features[0].id
        if (nowid === mapStore.specialHoveredStateId) {
          return
        }
        if (mapStore.specialHoveredStateId) {
          map.setFeatureState(
            { source: 'SpecialStates' + suf, id: mapStore.specialHoveredStateId },
            { hover: false }
          );
        }
        mapStore.setSpecialHoveredStateId(nowid)

        // Bus.emit('hoverd', e.features[0])
        map.setFeatureState(
          { source: 'SpecialStates' + suf, id: nowid },
          { hover: true }
        );
      }
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'SpecialMap' + suf, function (e) {
      if (mapStore.specialHoveredStateId) {
        map.setFeatureState(
          { source: 'SpecialStates' + suf, id: mapStore.specialHoveredStateId },
          { hover: false }
        );
      }
      // console.log(e, 'unhoverd')
      // mapStore.specialHoveredStateId = null;
      mapStore.setSpecialHoveredStateId(null)
      // Bus.emit('unhoverd', null)
    });

    return features
  }
  removeMapLay(suf = '') {

    if (this.map.getLayer("SpecialMap" + suf)) {
      console.log('remove1')
      this.map.removeLayer("SpecialMap" + suf);
    }
    if (this.map.getLayer("count" + suf)) {
      console.log('remove2')
      this.map.removeLayer("count" + suf);
      this.map.removeSource("count" + suf);
    }
    if (this.map.getLayer("SpecialBorder" + suf)) {
      console.log('remove3')
      this.map.removeLayer("SpecialBorder" + suf);
    }
    if (this.map.getSource("SpecialStates" + suf)) {
      console.log('remove4')
      this.map.removeSource("SpecialStates" + suf);
    }
  }
  removeMapLayHover(hover = '') {

    if (this.map.getLayer("SpecialMap" + hover)) {
      this.map.removeLayer("SpecialMap" + hover);
    }
    if (this.map.getLayer("count" + hover)) {
      this.map.removeLayer("count" + hover);
      this.map.removeSource("count" + hover);
    }
    if (this.map.getLayer("SpecialBorder" + hover)) {
      this.map.removeLayer("SpecialBorder" + hover);
    }
    if (this.map.getSource("SpecialStates" + hover)) {
      this.map.removeSource("SpecialStates" + hover);
    }
  }
}
export default SpecialMap;
