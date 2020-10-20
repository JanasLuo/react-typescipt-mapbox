import React from 'react'
import Mapbox from 'src/components/map/reactmap.jsx'

const MapPolygon = () => {
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
