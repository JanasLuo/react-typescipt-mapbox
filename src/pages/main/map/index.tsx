import React from 'react'
// import Mapbox from 'src/components/map/mapbox.jsx'
import Mapbox from 'src/components/map/reactmap.jsx'
// import Bus from 'src/utils/eventBus'
// import Bus from 'src/utils/eventBus'
// import * as ReactDOM from 'react-dom'
// import location from 'src/assets/image/location.svg'
// import mapboxgl from 'mapbox-gl'
// import turf from 'turf'
// import MapboxDraw from 'mapbox-gl-draw'

const MapPolygon = () => {
  // const mapObj: any = useRef<any>({
  //   map: null,
  //   draw: null
  // })
  // const pointLng: any = useRef({
  //   lng: 115.835093,
  //   lat: 28.756324
  // })

  // useEffect(() => {
  //   Bus.addListener('mapLoad', getMap)
  //   return willOut
  // }, [])

  // const getMap = (map: any) => {
  // mapObj.current.map = map
  // map.flyTo({
  //   zoom: 14,
  //   center: [pointLng.current.lng, pointLng.current.lat],
  //   speed: 2
  // })

  // initDraw()
  // }
  // function initDraw() {
  //   const draw = new MapboxDraw({
  //     displayControlsDefault: false,
  //     controls: {
  //       polygon: true,
  //       line_string: true,
  //       point: true,
  //       trash: true
  //     }
  //   })
  //   mapObj.current.draw = draw
  //   mapObj.current.map.addControl(draw)

  //   mapObj.current.map.on('draw.create', updateArea)
  //   mapObj.current.map.on('draw.delete', updateArea)
  //   mapObj.current.map.on('draw.update', updateArea)
  // }

  // function updateArea(e: any) {
  //   console.log(e)
  //   const data = mapObj.current.draw.getAll()
  //   // var answer = document.getElementById('calculated-area');
  //   if (data.features.length > 0) {
  //     const area = turf.area(data)
  //     console.log('area', area)
  //       // restrict to area to 2 decimal points
  //       var rounded_area = Math.round(area * 100) / 100;
  //       answer.innerHTML = '<p><strong>' + rounded_area + '</strong></p><p>square meters</p>';
  //     } else {
  //       answer.innerHTML = '';
  //       if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
  //   }
  // }

  // function willOut() {
  //   Bus.removeListener('mapLoad', getMap)
  // }
  return (
    <div className="map-polygon" style={{ width: '100%', height: '100%' }}>
      {/* <div className="map-left">
        <Mapbox2
          style={{ width: '100%', height: '100%' }}
          drawPolygon={true}
        ></Mapbox2>
      </div>
      <div className="map-right">
        <textarea>阿斯顿发斯蒂芬</textarea>
      </div> */}
      <Mapbox
        // style={{ width: '100%', height: '100%' }}
        // drawPolygon={true}
      ></Mapbox>
    </div>
  )
}

export default MapPolygon
