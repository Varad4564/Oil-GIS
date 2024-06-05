import React from 'react'
import { useMapEvents } from 'react-leaflet/hooks'
import { useEffect } from 'react';
import { useMap } from 'react-leaflet/hooks';
import 'leaflet.fullscreen';
import { useState } from 'react';


function MyLocationComponent2({setActiveMarker, flyToCoordinates, setCurrentLatLng, setMapZoom, setMapcenter}) {

    // const [isfullScreenButtonLoaded, setIsfullScreenButtonLoaded] = useState(false);
    const map2 = useMap();

    // useEffect(()=>{
    //     if(flyToCoordinates.length !== 0){
    //         map2.flyTo(flyToCoordinates,12)
    //     }

        
    // },[flyToCoordinates]);

    // useEffect(()=>{
    //         const fullscreenControl = L.control.fullscreen();   
    //         map2.addControl(fullscreenControl);

    //     return () => {
    //         map2.removeControl(fullscreenControl);
    //     };
    // },[])


    const map = useMapEvents({
        click: (event) => {
            console.log(event);
            const { lat, lng } = event.latlng;
            const newMarker = { lat, lng };
            setActiveMarker(newMarker);
            map.flyTo(event.latlng)
            // console.log(map.getCenter());
            
            // map.setView(event.latlng);
            // map.flyTo(event.latlng, 10)
            setMapcenter(map.getCenter());

            
            // map.setCurrentLatLng = event.latlng
        },

        mousemove: (event)=>{
            // console.log(event.latlng);
            if(setCurrentLatLng){
                setCurrentLatLng(event.latlng);
            }
        },

        contextmenu: (event)=>{
            setActiveMarker(null);
        },

        zoomend: (event) => {
            console.log("before set map zoom 2 "+map.getZoom());
            setMapZoom(map.getZoom());
        }, 

        moveend: (event)=>{
            setMapcenter(map.getCenter());
        }

    })
    return null

}

export default MyLocationComponent2;
