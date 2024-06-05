import React from 'react'

function ButtonList({obj, index, setFlyToCoordinates, checkedId, setCheckedId, setIsDestinationClicked}) {

  function handleRadioClick(index, latlng){
        
    setFlyToCoordinates((previousLatLng) => {
        let newLatLng = [...previousLatLng];
        newLatLng[0] = latlng[0];
        newLatLng[1] = latlng[1];
        return newLatLng;
    })

    setIsDestinationClicked(true);

    if(checkedId !== index){
        setCheckedId(index);
    }
}

  return (
    <div className="location-option-div">
        <input type="radio" name="loc" id={`loc${index}`} checked={checkedId === index} onChange={()=>handleRadioClick(index, obj.latlng)}/>
        <label htmlFor={`loc${index}`}><button onClick={()=>handleRadioClick(index, obj.latlng)}>{obj.name}</button></label>
    </div>
  )
}

export default ButtonList
