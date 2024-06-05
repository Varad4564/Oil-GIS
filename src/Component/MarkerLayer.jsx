import React from 'react'
import { Marker,Popup } from 'react-leaflet'
import PopupInfo from './PopupInfo'
import seaPortSvg from '../images/sea-port.svg'

function MarkerLayer({index, feature}) {

  let seaPortIcon = new L.icon(
    {
        // iconUrl: customIconSvg,
        iconUrl: seaPortSvg,
        iconSize:     [24, 48], // size of the icon
        iconAnchor:   [12, 37], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    }
  )

  return (
    <>
        {/* {index === 1 ? console.log(feature):""} */}
        
        
        <Marker position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]} icon={seaPortIcon}>
            <Popup>
                <PopupInfo feature={feature}/>
            </Popup>
        </Marker>
    </>
  )
}

export default MarkerLayer
