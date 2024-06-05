import React, { useEffect, useRef } from 'react'

import { MapContainer, TileLayer, Marker,Popup, WMSTileLayer, GeoJSON, LayersControl, Circle } from 'react-leaflet'
import { jobj } from '../data/geodata1'
import MarkerLayer from './MarkerLayer'
import { useState } from 'react'
import MyLocationComponent from './MyLocationComponent'
import 'leaflet/dist/leaflet.css';
import geojsonData from './mountain.json'
import { useMapEvents } from 'react-leaflet'
import { Polygon, Rectangle, FeatureGroup, Polyline } from 'react-leaflet'
import L, { marker } from 'leaflet'
import customIconUrl from './MountainLogo.png'
import clickedLocation from '../images/location.svg'
import { useSelector, useDispatch } from 'react-redux'
import { deleteRectangle } from '../ReduxRelated/Slices/ReactangleArraySlice'
import { deletePolygon } from '../ReduxRelated/Slices/PolygonArraySlice'
import pointIconSvg from "../images/Selected_point.svg";
import { deletePolyLine } from '../ReduxRelated/Slices/PolyLineArraySlice'
import { deleteCircle } from '../ReduxRelated/Slices/CircleArraySlice'
import SelectedFilelayeComponent from './SelectedFilelayeComponent'
import { setDrawGeometryMode } from '../ReduxRelated/Slices/DrawGeometryModeSlice'


function MyMap({ flyToCoordinates, mapZoom, setMapZoom, mapcenter, setMapcenter, activeMarker, setActiveMarker, setIsDestinationClicked, isDestinationClicked, showHistoryClick, activeSlideup, drawRectAngleState, setDrawRectAngleState, fileSelectionLayer}) {

  const wmsLayerParams = {
    layers: 'TOPO-OSM-WMS',
    // layers: 'LAYER_NAME', // Specify the name of the WMS layer
    format: 'image/png', // Image format
    transparent: true, // Transparency
    attribution: 'Your attribution here' // Attribution text
  };

  const customIcon = new L.Icon({
    iconUrl: customIconUrl, // Provide the path to your custom icon image
    iconSize: [38, 38], // Adjust the size as needed
    iconAnchor: [19, 38], // The point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] // The point from which the popup should open relative to the iconAnchor
  });

  const selectedLocationIcon = new L.Icon({
    iconUrl: clickedLocation, // Provide the path to your custom icon image
    iconSize: [38, 38], // Adjust the size as needed
    iconAnchor: [19, 40], // The point of the icon which will correspond to marker's location
    popupAnchor: [0, -38] // The point from which the popup should open relative to the iconAnchor
  });
  
  let customIcon2 = L.icon(
    {
        // iconUrl: customIconSvg,
        iconUrl: pointIconSvg,
        iconSize:     [14, 50], // size of the icon
        iconAnchor:   [6, 25], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    }
)
  
  // *** Functions Related to GeoJson Started ***

  const pointToLayer = (feature, latlng) => {
    return L.marker(latlng, { icon: customIcon });
  };
      
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
        const popupContent = 
            `<div>
              <h3>${feature.properties.name}</h3>
              <p>Height: ${feature.properties.elevation}</p>
              <a href={'https://example.com/details/${feature.properties.id}'}>More info</a>
            </div>`
        layer.bindPopup(`${popupContent}`); // Customize popup content
    }
  };

  // *** Functions Related to GeoJson Ended ***


  // *** Selectors related to Drawing Shape on Map Started ***

  let ReactangleArrayShape = useSelector((state)=>state.ReactangleArrayState);
  let PolygonArrayShape = useSelector((state)=>state.PolygonArrayState);
  let PolyLineArrayShape = useSelector((state)=>state.PolyLineArrayState);
  let CircleArrayShape = useSelector((state)=>state.CircleArrayState);
  
  // *** Selectors related to Drawing Shape on Map Ended ***

  let FullScreenMode = useSelector((state)=>state.FullScreenState);

  let SelectedFilelayerArrayShape = useSelector((state)=>state.SelectedFilelayerArrayState);
  
  let dispatch = useDispatch();

  const [rectangleCoordinates, setRectangleCoordinates] = useState(null);

  const [circleCenter,setCircleCenter] = useState(null);
  const [circleRadius,setCircleRadius] = useState(0);

  const [polyLineCoordinates, setPolyLineCoordinates] = useState(null);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);

  const [isGeometryRecentlyDeleted,setIsGeometryRecentlyDeleted] = useState(false);
  const [mapRefState,setMapRefState] = useState();

  const [isEditModeOn, setIsEditModeOn] = useState(false);
  
  const [tempHolder, setTempHolder] = useState([]);

  useEffect(()=>{
    console.log("Varad");
    setPolygonCoordinates(tempHolder);
  },[tempHolder])

  let dummyRef = useRef();

  const blackOptions = { color: 'black', fillOpacity: 0.38 }

  function handlePopupClose() {
    mapRefState.closePopup()
  }

  console.log(polygonCoordinates);

  return (
    <>
        <MapContainer center={mapcenter} zoom={mapZoom} maxZoom={25} scrollWheelZoom={true} ref={setMapRefState} className='varad'>

            {/* <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}

            {/* <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                // url="http://services.arcgisonline.com/arcgis/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
                // url="http://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
                // url="http://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                // url="http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                // url="https://{s}.tiles.mapbox.com/v3/mapbox.blue-marble-topo-bathy-jan/{z}/{x}/{y}.png"
            />   */}
            
            {/* The following will load a wms layer on the map  */}

            {/* <WMSTileLayer url={'http://ows.mundialis.de/services/service?'} {...wmsLayerParams}/> */}

            <LayersControl position="bottomleft" collapsed={true}>
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Google Maps">
                  <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
                    url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                  />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name="WMS Layer">
                  <WMSTileLayer url={'http://ows.mundialis.de/services/service?'} {...wmsLayerParams}/>
                </LayersControl.BaseLayer>

            </LayersControl>

            {/* The following is for loading data using geojson file */}

            {/* <Polygon pathOptions={purpleOptions} positions={polygon} /> */}
            
            {rectangleCoordinates &&<Rectangle bounds={rectangleCoordinates} pathOptions={{dashArray:"7"}}/>}
            
            {
                ReactangleArrayShape.array.map((rectInfo,index)=>{
                    // console.log(coordinates);
                    return (
                        <Rectangle pathOptions={blackOptions} key={rectInfo.id /*rectInfo.*/ } bounds={rectInfo.coordinates}>                            
                            <Popup>

                                <div className="upper-popup-div">
                                    <div className="popup-vertical-flex">
                                        <div className="flex-div-popup"> 
                                            <p className="flex-div-equal-items">Info </p>
                                            <p className="flex-div-equal-items">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                                        </div>
                                        <div className="flex-div-popup">
                                            <p className="flex-div-equal-items">Area (sq. km)</p>
                                            <p className="flex-div-equal-items">{rectInfo.area.toFixed(4)}</p>    
                                        </div>
                                        <div className="flex-div-popup"> 
                                            <p className="flex-div-equal-items">Perimeter (km)</p>
                                            <p className="flex-div-equal-items">{rectInfo.perimeter.toFixed(4)}</p>  
                                        </div>
                                    </div>
                                </div>
                                <div className="lower-popup-div">
                                    <p>Info</p>
                                </div>
                                <div className="popup-footer">
                                    <div className="popup-footer-section1">
                                        <button id="popup-footer-close-btn" onClick={handlePopupClose}>
                                            close
                                        </button>
                                    </div>
                                    <div className="popup-footer-section2">
                                        <button id='popup-footer-delete-btn' onClick={()=>{
                                            dispatch(deleteRectangle(rectInfo.id));
                                            setIsGeometryRecentlyDeleted(true);
                                        }}>
                                            Delete
                                        </button>
                                    </div>

                                </div>
                            </Popup>
                        </Rectangle>
                    )    
                })
            }



            {polyLineCoordinates && <Polyline positions={[...polyLineCoordinates]} pathOptions={{dashArray:"7"}}/>}

            {
                PolyLineArrayShape.array.map((polyInfo)=>{      
                    return(
                        <Polyline key={polyInfo.id} pathOptions={{...blackOptions, weight:4}} positions={[...polyInfo.coordinatesArray]}>
                            <Popup>
                                <div className="upper-popup-div">
                                    <div className="popup-vertical-flex">
                                        <div className="flex-div-popup"> 
                                            <p className="flex-div-equal-items">Information</p>
                                            <p className="flex-div-equal-items">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                                        </div>
                                        <div className="flex-div-popup">
                                            <p className="flex-div-equal-items">Distance (km)</p>
                                            <p className="flex-div-equal-items">{(polyInfo.distance.toFixed(2)/1000).toFixed(4)}</p>    
                                        </div>
                                    </div>
                                </div>
                                <div className="lower-popup-div">
                                    <p>Info</p>
                                </div>
                                <div className="popup-footer">
                                    <div className="popup-footer-section1">
                                        <button id="popup-footer-close-btn" onClick={handlePopupClose}>
                                            close
                                        </button>
                                    </div>
                                    <div className="popup-footer-section2">
                                        <button id='popup-footer-delete-btn' onClick={()=>{
                                            dispatch(deletePolyLine(polyInfo.id));
                                            setIsGeometryRecentlyDeleted(true);
                                        }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Polyline>
                    )
                }) 
            }

            {polygonCoordinates && <Polygon positions={polygonCoordinates} pathOptions={{dashArray:"8"}}></Polygon>}
            
            
            {polygonCoordinates && isEditModeOn && polygonCoordinates.map((individualCoordinates,index)=>{
                return (
                    <Marker key={individualCoordinates} position={individualCoordinates} draggable={true} icon={customIcon2}
                        eventHandlers={
                            {
                                drag: (e)=>{
                                    let temparray = [...polygonCoordinates];
                                    temparray[index] = [e.latlng.lat,e.latlng.lng];
                                    setPolyLineCoordinates(temparray);
                                    console.log("Pawar");
                                },
                            }
                        }
                    >

                    </Marker>
                );
            })}
 

            {
                PolygonArrayShape.array.map((polygonInfo)=>{
                    return(
                        <Polygon key={polygonInfo.id} pathOptions={blackOptions} positions={[...polygonInfo.coordinates]}>
                            <Popup>
                                <div className="upper-popup-div">
                                    <div className="popup-vertical-flex">
                                        <div className="flex-div-popup"> 
                                            <p className="flex-div-equal-items">Information</p>
                                            <p className="flex-div-equal-items">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                                        </div>
                                        <div className="flex-div-popup">
                                            <p className="flex-div-equal-items">Area (sq. km)</p>
                                            <p className="flex-div-equal-items">{polygonInfo.area.toFixed(4)}</p>    
                                        </div>
                                        <div className="flex-div-popup"> 
                                            <p className="flex-div-equal-items">Perimeter (km)</p>
                                            <p className="flex-div-equal-items">{polygonInfo.perimeter.toFixed(4)}</p>  
                                        </div>
                                    </div>
                                </div>
                                <div className="lower-popup-div">
                                    <button onClick={()=>{
                                        handlePopupClose();
                                        dispatch(deletePolygon(polygonInfo.id));
                                        setPolygonCoordinates([...polygonInfo.coordinates]);
                                        // dispatch(setDrawGeometryMode("editing the polygon"));
                                        setIsEditModeOn(true);
                                        setIsGeometryRecentlyDeleted(true);
                                    }}>Edit</button>
                                </div>
                                <div className="popup-footer">
                                    <div className="popup-footer-section1">
                                        <button id="popup-footer-close-btn" onClick={handlePopupClose}>
                                            close
                                        </button>
                                    </div>
                                    <div className="popup-footer-section2">
                                        <button id='popup-footer-delete-btn' onClick={()=>{
                                            dispatch(deletePolygon(polygonInfo.id));
                                            setIsGeometryRecentlyDeleted(true);
                                        }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Popup>
                        </Polygon>
                    )
                })
            }

            {circleCenter &&<Circle center={circleCenter} radius={circleRadius} pathOptions={{dashArray:"8"}}></Circle>}

            {
                CircleArrayShape.array.map((circleInfo)=>{
                    return(
                    <Circle key={circleInfo.id}  center={[...circleInfo.center]} radius={circleInfo.radius} fillOpacity={0.5} fillColor={'black'} color='black'>
                        <Popup ref={dummyRef}>
                            <div className="upper-popup-div">
                                <div className="popup-vertical-flex">
                                    <div className="flex-div-popup"> 
                                        <p className="flex-div-equal-items">Information</p>
                                        <p className="flex-div-equal-items">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                                    </div>
                                    <div className="flex-div-popup">
                                        <p className="flex-div-equal-items">Radius (km)</p>
                                        <p className="flex-div-equal-items">{(circleInfo.radius/1000).toFixed(4)}</p>    
                                    </div>
                                    <div className="flex-div-popup">
                                        <p className="flex-div-equal-items">Area (sq. m)</p>
                                        <p className="flex-div-equal-items">{(circleInfo.area/1000000).toFixed(4)}</p>    
                                    </div>
                                </div>
                            </div>
                            <div className="lower-popup-div">
                                <p>Info</p>
                            </div>
                            <div className="popup-footer">
                                <div className="popup-footer-section1">
                                    <button id="popup-footer-close-btn" onClick={handlePopupClose}>
                                        close
                                    </button>
                                </div>
                                <div className="popup-footer-section2">
                                    <button id='popup-footer-delete-btn' onClick={()=>{
                                        dispatch(deleteCircle(circleInfo.id));
                                        setIsGeometryRecentlyDeleted(true);
                                    }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Circle>);
                    
                })
            }

            <GeoJSON data={geojsonData} pointToLayer={pointToLayer} onEachFeature={onEachFeature}></GeoJSON>

            {jobj.features.map((feature, index) => <MarkerLayer key={String(feature.geometry.coordinates)} index={index} feature={feature}/>)}
            
            <MyLocationComponent setActiveMarker={setActiveMarker} flyToCoordinates={flyToCoordinates} setMapZoom={setMapZoom} setMapcenter={setMapcenter} setIsDestinationClicked={setIsDestinationClicked} isDestinationClicked={isDestinationClicked} drawRectAngleState={drawRectAngleState} setRectangleCoordinates={setRectangleCoordinates} setDrawRectAngleState={setDrawRectAngleState} isGeometryRecentlyDeleted={isGeometryRecentlyDeleted} setIsGeometryRecentlyDeleted={setIsGeometryRecentlyDeleted} setPolyLineCoordinates={setPolyLineCoordinates} polyLineCoordinates={polyLineCoordinates} rectangleCoordinates={rectangleCoordinates} setPolygonCoordinates={setPolygonCoordinates} polygonCoordinates={polygonCoordinates} setCircleCenter={setCircleCenter} circleCenter={circleCenter} setCircleRadius={setCircleRadius} circleRadius={circleRadius}/>

            {activeMarker && (
                <Marker position={[activeMarker.lat, activeMarker.lng]} icon={selectedLocationIcon}>
                    {/* opacity */}
                    <Popup>
                        <div className="upper-popup-div">
                            <div className="popup-vertical-flex">
                                <div className="flex-div-popup"> 
                                    <p className="flex-div-equal-items">Information</p>
                                    <p className="flex-div-equal-items">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                                </div>
                                <div className="flex-div-popup">
                                    <p className="flex-div-equal-items">Latitude</p>
                                    <p className="flex-div-equal-items">{activeMarker.lat.toFixed(4)}</p>    
                                </div>
                                <div className="flex-div-popup"> 
                                    <p className="flex-div-equal-items">Longitude</p>
                                    <p className="flex-div-equal-items">{activeMarker.lng.toFixed(4)}</p>  
                                </div>
                            </div>
                        </div>
                        <div className="lower-popup-div">
                            <p>Info</p>
                        </div>
                        <div className="popup-footer">
                            <div className="popup-footer-section1">
                                <button id="popup-footer-close-btn" onClick={handlePopupClose}>
                                    close
                                </button>
                            </div>
                            <div className={`popup-footer-section2 ${!FullScreenMode.isFullScreen && 'display-none-class'}`}>
                                {FullScreenMode.isFullScreen && <div style={{display:'flex', justifyContent:'center', marginTop:'4px'}}>
                                    <button style={{backgroundColor:'red', padding:'4px',color:'white', border:'1px solid black', borderRadius:'5px'}} onClick={showHistoryClick}>{!activeSlideup?'Show History':'hide history'}</button>
                                </div>}        
                            </div>
                        </div>
                    </Popup>
                    
                </Marker>
            )}

            { 
                SelectedFilelayerArrayShape.array.map((individualLayer)=>{
                    console.log(individualLayer);
                    return(
                        <SelectedFilelayeComponent key={individualLayer.layerId} individualLayer={individualLayer}/>
                    )
                }) 
            }

        </MapContainer>


    </>
  )
}

export default MyMap;