import React from 'react'
import MyMap from './MyMap'
import menuLogo from '../images/menulogo.png'
import settingLogo from '../images/setting.png'
import { useState, useEffect } from 'react'
import fullScreenLogo from '../images/fullScreen.png'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFullScreenState } from '../ReduxRelated/Slices/FullScreenSlice'
import { setDrawGeometryMode } from '../ReduxRelated/Slices/DrawGeometryModeSlice'
import polygonLogo  from '../images/PolygonImage.png'
import lineSegment  from '../images/lineSegmentLogo.png'
import squareImage from '../images/squareImageScreenshot.png'
import circleImage from '../images/newCircleLogo.png'
import * as tj from "@mapbox/togeojson";
import rewind from "@mapbox/geojson-rewind";
import { addFileLayer } from '../ReduxRelated/Slices/SelectedFilelayerArraySlice'


function MainDivComponent({ flyToCoordinates, setAdministrativeComponentActive, setSideComponentActive, mapZoom, setMapZoom, mapcenter, setMapcenter, activeMarker, setActiveMarker, setIsDestinationClicked, isDestinationClicked, adminComponentActive}) {

    let [currentLatLng, setCurrentLatLng] = useState(null);

    let [drawRectAngleState, setDrawRectAngleState] = useState(null);

    let currentCoordinates = useSelector((state) => state.CurrentLatLngState);

    let drawGeometryMode = useSelector((state)=> state.DrawGeometryModeState);

    let [uidState, setUidState] = useState(1);

    // console.log(currentLatLng);

    let dispatch = useDispatch();

// -------------------------------------------------------------------------------------------------------------------------------------------

const [fileSelectionLayer, setFileSelectionLayer] = useState(null);

    const handleFileSelection = (event) => {
    const file = event.target.files[0]; // get file
    const ext = getFileExtension(file);
    const reader = new FileReader();

    // on load file end, parse the text read
    reader.onloadend = (event) => {
        var text = event.target.result;
        if (ext === "kml") {
          parseTextAsKml(text);
        } else {
            // imported geojson
            const json = JSON.parse(text);
            rewind(json, false);
            
            // console.log(json.features[0].geometry.coordinates[0]);   //Polygon
            // console.log(json.features[0].geometry.coordinates);
            // console.log(json.features[0].geometry.coordinates);
            
            let addFileObject = {
                layerId: uidState,
                type: "LineString",
                layer: json,
            }
        
            setUidState(previousUidValue=>{previousUidValue+1});

            dispatch(addFileLayer(addFileObject));
            setFileSelectionLayer(json);
        }
    };

    reader.readAsText(file); // start reading file
};

const parseTextAsKml = (text) => {
    const dom = new DOMParser().parseFromString(text, "text/xml"); // create xml dom object
    const converted = tj.kml(dom); // convert xml dom to geojson
    rewind(converted, false); // correct right hand rule
    
    let addFileObject = {
        layerId: uidState,
        type: "LineString",
        layer: converted,
    }
    
    setUidState(previousUidValue=>{previousUidValue+1});
    dispatch(addFileLayer(addFileObject));

    console.log(converted);
    setFileSelectionLayer(converted); // save converted geojson to hook state
};

const getFileExtension = (file) => {
    const name = file.name;
    const lastDot = name.lastIndexOf(".");
    return name.substring(lastDot + 1);
};



// -------------------------------------------------------------------------------------------------------------------------------------------



    return (
        <div className={`${adminComponentActive ? "functional-div":"functional-div"}`}>

            <div className="toolbar">

                <img src={menuLogo} alt="" className="sidebar-button" onClick={() => {
                        setSideComponentActive((previousState) => {
                            return !previousState
                        })
                        setAdministrativeComponentActive(false);
                    }
                } />
                <img src={settingLogo} alt="Img" className='admin-button' onClick={() => {
                    setAdministrativeComponentActive((previousState) => {
                        return !previousState
                    });
                    setSideComponentActive(false);
                }} />

            </div>

            <div className="map-and-chart-container">
                
                <div className="map-stat-container">
                    <div className='map-holder'>
                        <button className='full-screen-button' onClick={()=>{
                            dispatch(toggleFullScreenState())
                            dispatch(setDrawGeometryMode(null));
                        }}><img src={fullScreenLogo} className='full-screen-logo'/></button>
                        <button style={{top:'36.8px', justifyContent:"center", alignItems:"center", height:'28.9px', width:"28.9px"}} className='full-screen-button' onClick={()=>{
                            
                            if(drawGeometryMode.mode){ 
                                dispatch(setDrawGeometryMode(null));
                            }
                            else{
                                dispatch(setDrawGeometryMode("PolyLine Mode turned on"));
                            }
                            
                        }}>
                            <img src={lineSegment} className='full-screen-logo'/>
                        </button>
                        <button style={{top:'64px', justifyContent:"center", alignItems:"center", height:'30px', width:"28.9px"}} className='full-screen-button' onClick={()=>{
                            
                            if(drawGeometryMode.mode){ 
                                dispatch(setDrawGeometryMode(null));
                            }
                            else{
                                dispatch(setDrawGeometryMode("Polygon Mode turned on"));
                            }
                        }}>
                            <img src={polygonLogo} className='full-screen-logo'/>
                        </button>
                        <button style={{top:'92.9px', justifyContent:"center", alignItems:"center", height:'30px', width:"28.9px"}} className='full-screen-button' onClick={()=>{
                            
                            if(drawGeometryMode.mode){ 
                                dispatch(setDrawGeometryMode(null));
                            }
                            else{
                                dispatch(setDrawGeometryMode("selecting first point"));
                            }
                        }}>
                            <img src={squareImage} className='full-screen-logo'/>
                        </button>
                        <button style={{top:'121.2px', justifyContent:"center", alignItems:"center", height:'30px', width:"28.9px"}} className='full-screen-button' onClick={()=>{
                            
                            if(drawGeometryMode.mode){ 
                                dispatch(setDrawGeometryMode(null));
                            }
                            else{
                                dispatch(setDrawGeometryMode("selecting center for circle"));
                            }
                        }}>
                            <img src={circleImage} className='full-screen-logo'/>
                        </button>
                        <MyMap flyToCoordinates={flyToCoordinates} setCurrentLatLng={setCurrentLatLng} mapZoom={mapZoom} setMapZoom={setMapZoom} mapcenter={mapcenter} setMapcenter={setMapcenter} activeMarker={activeMarker} setActiveMarker={setActiveMarker} setIsDestinationClicked={setIsDestinationClicked} isDestinationClicked={isDestinationClicked} drawRectAngleState={drawRectAngleState} setDrawRectAngleState={setDrawRectAngleState} fileSelectionLayer={fileSelectionLayer}/>

                    </div>

                    <div className="stat-container">
                        <div className="coordinates-container">
                            <input type="file" onChange={handleFileSelection}/>
                            {/* <p>Area</p> */}
                            <div style={{display:"flex"}}>
                                <p>Coordinates: </p>
                                <div className='coordinates-readings'>
                                    {/* <p>{currentLatLng ? currentLatLng.lat.toFixed(4) : "null"}, {currentLatLng ? currentLatLng.lng.toFixed(4) : "null"}</p> */}
                                    <p id="current-latlng-container">null, null</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            
                            <button onClick={()=>{

                                // if(drawRectAngleState){ //drawGeometryMode.mode
                                //     setDrawRectAngleState(null);    //dispatch(setDrawGeometryMode(null));
                                // }
                                // else{
                                //     setDrawRectAngleState("selecting first point");     //dispatch(setDrawGeometryMode("selecting first point"));
                                // }

                                if(drawGeometryMode.mode){ 
                                    dispatch(setDrawGeometryMode(null));
                                }
                                else{
                                    dispatch(setDrawGeometryMode("selecting first point"));
                                }

                            }}>
                                Draw Rectangle
                            </button>
                            <button onClick={()=>{
                                
                                // if(drawRectAngleState){ //drawGeometryMode.mode
                                //     setDrawRectAngleState(null);    //dispatch(setDrawGeometryMode(null));
                                // }
                                // else{
                                //     setDrawRectAngleState("PolyLine Mode turned on");   //dispatch(setDrawGeometryMode("PolyLine Mode turned on"));
                                // }

                                if(drawGeometryMode.mode){ 
                                    dispatch(setDrawGeometryMode(null));
                                }
                                else{
                                    dispatch(setDrawGeometryMode("PolyLine Mode turned on"));
                                }

                            }}>
                                Draw PolyLine
                            </button>
                            <button onClick={()=>{
                                
                                // if(drawRectAngleState){ //drawGeometryMode.mode
                                //     setDrawRectAngleState(null);    //dispatch(setDrawGeometryMode(null));
                                // }
                                // else{
                                //     setDrawRectAngleState("Polygon Mode turned on");    //dispatch(setDrawGeometryMode("Polygon Mode turned on"));
                                // }

                                if(drawGeometryMode.mode){ 
                                    dispatch(setDrawGeometryMode(null));
                                }
                                else{
                                    dispatch(setDrawGeometryMode("Polygon Mode turned on"));
                                }

                            }}>
                                Draw Polygon
                            </button>

                        </div>
                    </div>

                </div>

                <div className="chart-container"></div>
            
            </div>

        </div>
    )
}

export default MainDivComponent;