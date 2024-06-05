import React, { useRef } from 'react'
import { useMapEvents } from 'react-leaflet/hooks'
import { useEffect } from 'react';
import { useMap } from 'react-leaflet/hooks';
import 'leaflet.fullscreen';
import { useState } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import { useDispatch, useSelector } from 'react-redux';
import { addReactangle } from '../ReduxRelated/Slices/ReactangleArraySlice';

import { setCurrentLatLong } from '../ReduxRelated/Slices/CurrentLatLngSlice';
import { addPolygon } from '../ReduxRelated/Slices/PolygonArraySlice';

import pointIconSvg from "../images/Selected_point.svg";
import { setDrawGeometryMode } from '../ReduxRelated/Slices/DrawGeometryModeSlice';
import { addPolyLine } from '../ReduxRelated/Slices/PolyLineArraySlice';
import { addCircle } from '../ReduxRelated/Slices/CircleArraySlice';

function MyLocationComponent({setActiveMarker, flyToCoordinates, setMapZoom, setMapcenter, setIsDestinationClicked, isDestinationClicked, setRectangleCoordinates, isGeometryRecentlyDeleted , setIsGeometryRecentlyDeleted, setPolyLineCoordinates, polyLineCoordinates, rectangleCoordinates, setPolygonCoordinates, polygonCoordinates, setCircleCenter, circleCenter, setCircleRadius, circleRadius}) {
    
    let customIcon = L.icon(
        {
            // iconUrl: customIconSvg,
            iconUrl: pointIconSvg,
            iconSize:     [14, 50], // size of the icon
            iconAnchor:   [6, 25], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
        }
    )

    // const [isfullScreenButtonLoaded, setIsfullScreenButtonLoaded] = useState(false);
    const map2 = useMap();
    const dispatch = useDispatch();



    useEffect(()=>{
        // if(flyToCoordinates.length !== 0){
        if(isDestinationClicked){ 
            setIsDestinationClicked(false)
            map2.flyTo(flyToCoordinates,12)
        }

        
    // },[flyToCoordinates]);
    },[isDestinationClicked, flyToCoordinates, map2, setIsDestinationClicked]);

    // if(drawRectAngleState!==null){

    // }

    let [tempPointHolderForPolyLine1, setTempPointHolderForPolyLine1] = useState(null);
    let [tempPointHolderForPolyLine2, setTempPointHolderForPolyLine2] = useState(null);
    let [tempPointHolderForPolygon, setTempPointHolderForPolygon] = useState(null);

    let [flagForPolyLine, setFlagForPolyLine] = useState(0);

    let [uidState, setUidState] = useState(1);

    let drawGeometryMode = useSelector((state)=> state.DrawGeometryModeState);

    useEffect(()=>{
        if(tempPointHolderForPolyLine2){
            map2.removeLayer(tempPointHolderForPolyLine2);
            setTempPointHolderForPolyLine2(null);
        }
    },[tempPointHolderForPolyLine1])

    const map = useMapEvents({
        click: (event) => {

            if(drawGeometryMode.mode===null || drawGeometryMode.mode===undefined){    //drawGeometryMode.mode
                if(isGeometryRecentlyDeleted){
                    setIsGeometryRecentlyDeleted(false);
                }
                else{
                    const { lat, lng } = event.latlng;
                    const newMarker = { lat, lng };
                    setActiveMarker(newMarker);
                    map.flyTo(event.latlng)
                    
                    setMapcenter([map.getCenter().lat,map.getCenter().lng]);
                }
    
            }

            if(drawGeometryMode.mode === "selecting first point"){     //drawGeometryMode.mode

                setRectangleCoordinates([[event.latlng.lat,event.latlng.lng],[event.latlng.lat,event.latlng.lng]]); // addInitail2Points
                // setDrawRectAngleState("selecting second point");    //dispatch(setDrawGeometryMode("selecting second point"));
                dispatch(setDrawGeometryMode("selecting second point"));
            }

            if(drawGeometryMode.mode === "selecting second point"){

                let tempLat = rectangleCoordinates[0][0];   
                let tempLng = rectangleCoordinates[0][1];   

                let LatMin;
                let LatMax;
                let LngMin;
                let LngMax;

                if(tempLat>rectangleCoordinates[1][0]){     
                    LatMin = rectangleCoordinates[1][0];    
                    LatMax = tempLat;
                }
                else{
                    LatMax = rectangleCoordinates[1][0];  
                    LatMin = tempLat;
                }

                if(tempLat>rectangleCoordinates[1][1]){     
                    LngMin = rectangleCoordinates[1][1];    
                    LngMax = tempLng;
                }
                else{
                    LngMax = rectangleCoordinates[1][1];  
                    LngMin = tempLng;
                }

                let hold = turf.polygon([[ [LngMin, LatMax], [LngMin, LatMin], [LngMax, LatMin], [LngMax, LatMax], [LngMin, LatMax] ]]);

                dispatch(addReactangle({
                    id: uidState,
                    perimeter: turf.length(hold, { units: 'kilometers' }),
                    area: (turf.area(hold)/1000000),
                    coordinates: rectangleCoordinates,
                }))

                setUidState(previousVal => {
                    return previousVal+1;
                })

                setRectangleCoordinates(null);          

                dispatch(setDrawGeometryMode(null));

            }
            // if(drawRectAngleState === "PolyLine Mode turned on"){   //drawGeometryMode.mode  
            if(drawGeometryMode.mode === "PolyLine Mode turned on"){   
                setTempPointHolderForPolyLine1(L.marker([event.latlng.lat,event.latlng.lng],{icon:customIcon}).addTo(map));

                setPolyLineCoordinates([[event.latlng.lat,event.latlng.lng],[event.latlng.lat,event.latlng.lng]]);

                // setDrawRectAngleState("selecting subsequent point for polyline");   //dispatch(setDrawGeometryMode());
                dispatch(setDrawGeometryMode("selecting subsequent point for polyline"));   //dispatch(setDrawGeometryMode());
            }
            if(drawGeometryMode.mode === "selecting subsequent point for polyline"){   //drawGeometryMode.mode 

                if(tempPointHolderForPolyLine2){
                    map.removeLayer(tempPointHolderForPolyLine2); 
                    setTempPointHolderForPolyLine2(null);
                }

                var marker = L.marker([event.latlng.lat, event.latlng.lng],{title:"varad", opacity: 0.9, icon:customIcon}).addTo(map);
            
                setTempPointHolderForPolyLine2(marker); // Update the last marker variable
                var lat = event.latlng.lat;
                var lng = event.latlng.lng;

                setPolyLineCoordinates(previousArray=>{
                    let tempArray = previousArray;
                    tempArray.push([event.latlng.lat,event.latlng.lng]);
                    return tempArray;
                });

                marker.on('click',()=>{
                    map.removeLayer(tempPointHolderForPolyLine1);
                    setTempPointHolderForPolyLine1(null);
                    setFlagForPolyLine(0);
                    // map.removeLayer(this);
                    setPolyLineCoordinates(previousArray=>{
                        let tempArray = previousArray;
                        tempArray.pop();
                        return tempArray;
                    })
                    
                    let polyLineDistance = 0;
                    
                    for(let i = 0;i<polyLineCoordinates.length-1;i++){
                        polyLineDistance+=map.distance(polyLineCoordinates[i],polyLineCoordinates[i+1])
                    }

                     
                    dispatch(addPolyLine({
                        id: uidState,
                        distance: polyLineDistance,
                        coordinatesArray: polyLineCoordinates,
                    }));
                    

                    // setPolyLineArray(previousArray=>{
                    //     return [...previousArray, {
                    //         id: uidState,
                    //         distance: polyLineDistance,
                    //         coordinatesArray: polyLineCoordinates,
                    //     }]
                    // })

                    setUidState(previousVal => {
                        return previousVal+1;
                    })

                    setPolyLineCoordinates([]);

                    // setDrawRectAngleState(null);    //dispatch(setDrawGeometryMode())
                    dispatch(setDrawGeometryMode(null));    //dispatch(setDrawGeometryMode())
                })
            }
            // if(drawRectAngleState === "Polygon Mode turned on"){    //drawGeometryMode.mode 
            if(drawGeometryMode.mode === "Polygon Mode turned on"){     
                setPolygonCoordinates(previousArray => {
                    let tempArray = previousArray;
                    tempArray.push([event.latlng.lat,event.latlng.lng]);
                    tempArray.push([event.latlng.lat,event.latlng.lng]);
                    return tempArray;
                })
                // setDrawRectAngleState("selecting subsequent point for polygon");        //dispatch(setDrawGeometryMode())
                dispatch(setDrawGeometryMode("selecting subsequent point for polygon"));        //dispatch(setDrawGeometryMode())
            }
            // if(drawRectAngleState === "selecting subsequent point for polygon"){    //drawGeometryMode.mode
            if(drawGeometryMode.mode === "selecting subsequent point for polygon"){     

                if(tempPointHolderForPolygon){
                    map.removeLayer(tempPointHolderForPolygon); 
                    setTempPointHolderForPolygon(null);
                }

                var marker2 = L.marker([event.latlng.lat, event.latlng.lng],{opacity: 0.9, icon:customIcon}).addTo(map);
            
                setTempPointHolderForPolygon(marker2) ; // Update the last marker variable

                setPolygonCoordinates(previousArray=>{
                    let tempArray = previousArray;
                    tempArray.push([event.latlng.lat,event.latlng.lng]);
                    return tempArray;
                });

                marker2.on('click',()=>{

                    setPolygonCoordinates(previousArray=>{
                        let tempArray = previousArray;
                        tempArray.pop();
                        return tempArray;
                    })

                    map.removeLayer(marker2);
                    setTempPointHolderForPolygon(null);

                    function isClockwise(coordinates) {
                        let sum = 0;
                        
                        for (let i = 0; i < coordinates.length - 1; i++) {
                            const [x1, y1] = coordinates[i];
                            const [x2, y2] = coordinates[i + 1];
                            
                            sum += (x2 - x1) * (y2 + y1);
                        }
                    
                        return sum > 0;
                    }

                    let measurementPolygonCoordinates = null;

                    let temporaryPolygonCoordinates = polygonCoordinates 

                    temporaryPolygonCoordinates = temporaryPolygonCoordinates.map(innerArray => [innerArray[1], innerArray[0]]);

                    if( isClockwise(temporaryPolygonCoordinates) ){
                        measurementPolygonCoordinates = temporaryPolygonCoordinates;
                        // measurementPolygonCoordinates.push(polygonCoordinates[0]);
                    }else{
                        measurementPolygonCoordinates = temporaryPolygonCoordinates;
                        const part1 = measurementPolygonCoordinates.slice(0, 1);
                        const part2 = measurementPolygonCoordinates.slice(1).reverse();
                        measurementPolygonCoordinates = part1.concat(part2);
                        // measurementPolygonCoordinates.push(polygonCoordinates[0]);
                    }
                    
                    // measurementPolygonCoordinates = measurementPolygonCoordinates.map(innerArray => [innerArray[1], innerArray[0]]);

                    measurementPolygonCoordinates = [...measurementPolygonCoordinates,temporaryPolygonCoordinates[0]];

                    let dummyPolygonReference = turf.polygon([[...measurementPolygonCoordinates]]);

                    dispatch(addPolygon({
                        id: uidState,
                        area: (turf.area(dummyPolygonReference)/1000000),
                        perimeter: turf.length(dummyPolygonReference, { units: 'kilometers' }),
                        coordinates: polygonCoordinates
                    }))

                    setPolygonCoordinates([]);

                    setUidState(previousVal=>previousVal+1);

                    // setDrawRectAngleState(null);    //dispatch()
                    dispatch(setDrawGeometryMode(null));    
                })

            }

            if(drawGeometryMode.mode === "selecting center for circle"){
                setCircleCenter([event.latlng.lat,event.latlng.lng]);
                dispatch(setDrawGeometryMode("determining radius for the circle"));
            }
            if(drawGeometryMode.mode === "determining radius for the circle"){
                var center = [circleCenter[1], circleCenter[0]];
                var radius = circleRadius/1000;
                var options = {units: 'kilometers'};
                var circle = turf.circle(center, radius, options);
                // var area = turf.area
                dispatch(addCircle({
                    id: uidState,
                    center: circleCenter,
                    radius: circleRadius,
                    area: turf.area(circle),
                }));
                setCircleCenter(null);
                setCircleRadius(0);
                setUidState(previousVal=>previousVal+1);
                dispatch(setDrawGeometryMode(null));
            }
            
        },

        mousemove: (event)=>{

            const latlng = event.latlng;
            const pElement = document.getElementById('current-latlng-container');
            if (pElement) {
              pElement.textContent = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
            }

            if(drawGeometryMode.mode==="selecting second point"){   
                setRectangleCoordinates((previousCoordinate)=>{     //replacingLastCoordinates 
                    return [previousCoordinate[0],[event.latlng.lat,event.latlng.lng]];
                });
            }

            if(drawGeometryMode.mode === "selecting subsequent point for polyline"){   

                let tempArray = [...polyLineCoordinates];
                tempArray.pop();    
                tempArray.push([event.latlng.lat,event.latlng.lng]);
                setPolyLineCoordinates(tempArray);
            }

            if(drawGeometryMode.mode === "selecting subsequent point for polygon"){   
                let tempArray = [...polygonCoordinates];
                tempArray.pop();    
                tempArray.push([event.latlng.lat,event.latlng.lng]);
                setPolygonCoordinates(tempArray);
            }
            if(drawGeometryMode.mode === "determining radius for the circle"){
                setCircleRadius(map.distance(circleCenter,[event.latlng.lat,event.latlng.lng]));
            }
            
        },

        contextmenu: ()=>{
            setActiveMarker(null);
        },

        zoomend: () => {
            setMapZoom(map.getZoom());
        }, 

        // moveend: (event)=>{
        //     setMapcenter(map.getCenter());
        // },
        
        moveend: () => {
            const newCenter = map.getCenter();
            setMapcenter((prevCenter) => {
              const distance = Math.sqrt(
                Math.pow(newCenter.lat - prevCenter[0], 2) +
                Math.pow(newCenter.lng - prevCenter[1], 2)
              );
              // Only update if the center has changed significantly
              if (distance > 0.001) {
                return [newCenter.lat, newCenter.lng];
              }
              return prevCenter;
            });
        }
    })

    return null

}

export default MyLocationComponent;
