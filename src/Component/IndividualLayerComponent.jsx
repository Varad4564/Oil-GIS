import React from 'react'

function IndividualLayerComponent({individualComponent}) {
  return (
    <div className='layers-container'>
        
        <div className="check-box-div">
            <input type="checkbox" />
        </div>

        <div className="location-transperancy-div">
            <div>{individualComponent.name}</div>

            <div className="transperancy-div">
                <label htmlFor="transparency-slider" className="slider-label">Transparency:</label>
                <input type="range" min="0" max="100" className="slider-input" id="transparency-slider" />
                <input type="number" min="0" max="100" className="value-input" id="transparency-value"></input>
            </div>
        </div>

    </div> 
  )
}

export default IndividualLayerComponent
