import React from 'react'
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet'
import { jobj } from '../data/geodata1'
import { useState, useRef, useEffect } from 'react'
import MyLocationComponent from './MyLocationComponent'
import MarkerLayer from './MarkerLayer'
import SmallScreenLogo from '../images/smallScreen.png'
import { popup } from 'leaflet'
import MyMap from './MyMap'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFullScreenState } from '../ReduxRelated/Slices/FullScreenSlice'
import polygonLogo  from '../images/PolygonImage.png'
import lineSegment  from '../images/lineSegmentLogo.png'
import squareImage from '../images/squareImageScreenshot.png'
import circleImage from '../images/newCircleLogo.png'
import { setDrawGeometryMode } from '../ReduxRelated/Slices/DrawGeometryModeSlice'


function FullScreenMapComponent({mapcenter, setMapcenter, mapZoom, setMapZoom, activeMarker, setActiveMarker,}) {

    const [activeSlideup, setActiveSlideup] = useState(false);

    function showHistoryClick() {
        setActiveSlideup(!activeSlideup);
    }

    let dispatch = useDispatch();

    let drawGeometryMode = useSelector((state)=> state.DrawGeometryModeState);    

    return (
        
        <div style={{position:'relative',height:'100vh', width:'100vw', overflow:"hidden"}}>
            <button className='small-screen-button' onClick={()=>{
                dispatch(toggleFullScreenState())
                dispatch(setDrawGeometryMode(null));
            }}><img src={SmallScreenLogo} className='small-screen-logo'/></button>
            <button className='small-screen-button' style={{top:"42.7px"}} onClick={()=>{
                if(drawGeometryMode.mode){ 
                    dispatch(setDrawGeometryMode(null));
                }
                else{
                    dispatch(setDrawGeometryMode("PolyLine Mode turned on"));
                }
            }}><img src={lineSegment} className='small-screen-logo'/></button>
            <button className='small-screen-button' style={{top:"75.5px"}} onClick={()=>{
                if(drawGeometryMode.mode){ 
                    dispatch(setDrawGeometryMode(null));
                }
                else{
                    dispatch(setDrawGeometryMode("Polygon Mode turned on"));
                }
            }}><img src={polygonLogo} className='small-screen-logo'/></button>
            <button className='small-screen-button' style={{top:"108.3px"}} onClick={()=>{
                if(drawGeometryMode.mode){ 
                    dispatch(setDrawGeometryMode(null));
                }
                else{
                    dispatch(setDrawGeometryMode("selecting first point"));
                }
            }}><img src={squareImage} className='small-screen-logo'/></button>
            <button className='small-screen-button' style={{top:"141.1px"}} onClick={()=>{
                if(drawGeometryMode.mode){ 
                    dispatch(setDrawGeometryMode(null));
                }
                else{
                    dispatch(setDrawGeometryMode("selecting center for circle"));
                }
            }}><img src={circleImage} className='small-screen-logo'/></button>
            
            <MyMap mapcenter={mapcenter} mapZoom={mapZoom} scrollWheelZoom={true} setMapZoom={setMapZoom} setMapcenter={setMapcenter} setActiveMarker={setActiveMarker} activeMarker={activeMarker} showHistoryClick={showHistoryClick} activeSlideup={activeSlideup}/>

            <div className={`slideup-container ${activeSlideup ? '':'hidden-slideup'}`} style={{zIndex:1000, backgroundColor:'grey'}}>
                
                <div className='left-fixed-component'></div>
                
                <div className="slideup-scrollable-content">
                    <div className="day-wise-data">Item 1</div>
                    <div className="day-wise-data">Item 2</div>
                    <div className="day-wise-data">Item 3</div>
                    <div className="day-wise-data">Item 4</div>
                    <div className="day-wise-data">Item 5</div>
                    <div className="day-wise-data">Item 6</div>
                    <div className="day-wise-data">Item 7</div>
                    <div className="day-wise-data">Item 8</div>
                    <div className="day-wise-data">Item 9</div>
                    <div className="day-wise-data">Item 10</div>
                    <div className="day-wise-data">Item 11</div>
                    <div className="day-wise-data">Item 12</div>
                </div>

            </div>

        </div>
    )
}

export default FullScreenMapComponent
