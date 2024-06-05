import React from 'react'
import { Polygon, Rectangle, Marker, Polyline } from 'react-leaflet'
import { useMap } from 'react-leaflet/hooks';

function SelectedFilelayeComponent({ individualLayer }) {

  let map = useMap();

  const convertGeoJSONToLeaflet = (geoJsonCoordinates) => {
    // Ensure the coordinates array is not empty
    if (!geoJsonCoordinates || geoJsonCoordinates.length === 0) {
        throw new Error('Invalid GeoJSON coordinates');
    }
    
    // Convert the coordinates
    const leafletCoordinates = geoJsonCoordinates.map(coord => [coord[1], coord[0]]);
    console.log(leafletCoordinates.pop());
    return leafletCoordinates;
  };

  function calculatePolyLineDistance(polyLineCoordinates) {
    let polyLineDistance = 0;
                    
    for(let i = 0;i<polyLineCoordinates.length-1;i++){
        polyLineDistance+=map.distance(polyLineCoordinates[i],polyLineCoordinates[i+1])
    }
    return polyLineDistance;
  }

  function isClockwise(coordinates) {
    let sum = 0;
    
    for (let i = 0; i < coordinates.length - 1; i++) {
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[i + 1];
        
        sum += (x2 - x1) * (y2 + y1);
    }

    return sum > 0;
  }



  function getTurfPolygonreference() {
    let measurementPolygonCoordinates = null;

    let temporaryPolygonCoordinates = polygonCoordinates 

    temporaryPolygonCoordinates = temporaryPolygonCoordinates.map(innerArray => [innerArray[1], innerArray[0]]);

    // console.log(temporaryPolygonCoordinates);

    if( isClockwise(temporaryPolygonCoordinates) ){                
        measurementPolygonCoordinates = temporaryPolygonCoordinates;
    }
    else{               
        measurementPolygonCoordinates = temporaryPolygonCoordinates;
        const part1 = measurementPolygonCoordinates.slice(0, 1);
        const part2 = measurementPolygonCoordinates.slice(1).reverse();
        measurementPolygonCoordinates = part1.concat(part2);
        // measurementPolygonCoordinates.push(polygonCoordinates[0]);
    }

    measurementPolygonCoordinates = [...measurementPolygonCoordinates,temporaryPolygonCoordinates[0]];
                    
    // console.log(measurementPolygonCoordinates);

    let dummyPolygonReference = turf.polygon([[...measurementPolygonCoordinates]]);  
    return dummyPolygonReference;
  }  



  return (
    <>
       {
                individualLayer.layer.features.map((individualFeature)=>{
                    if(individualFeature.geometry.type==="Point"){
                        return (
                            <Marker position={[individualFeature.geometry.coordinates[1],individualFeature.geometry.coordinates[0]]}>

                            </Marker>
                        )
                    }
                    else if(individualFeature.geometry.type==="Polygon"){
                        return (<Polygon positions={convertGeoJSONToLeaflet(individualFeature.geometry.coordinates[0])} fillOpacity={0.5} fillColor={'black'} color='black'></Polygon>)
                    }
                    else if(individualFeature.geometry.type==="LineString"){
                        return (<Polyline positions={convertGeoJSONToLeaflet(individualFeature.geometry.coordinates)} fillOpacity={0.5} fillColor={'black'} color='black'></Polyline>)
                    }
                })

                // fileSelectionLayer && fileSelectionLayer.features[0].geometry.type==="Point" && (
                //     // <GeoJSON data={fileSelectionLayer}/>
                //     <Marker position={[fileSelectionLayer.features[0].geometry.coordinates[1],fileSelectionLayer.features[0].geometry.coordinates[0]]}></Marker>
                // )
                
        }
    </>
  )
}

export default SelectedFilelayeComponent
