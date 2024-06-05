import React from 'react'

function PopupInfo({feature}) {
  return (
    <div>
      <div className="popup-info">
        <div className='index'>
            <p>Column 1</p>
            <p>Column 2</p>
        </div>
        <div className='info-body'>
          {Object.keys(feature.properties).map((key, idx) => {
             return(
             <div className="row">
                 <div>
                     <p key={idx}>{key}</p>
                 </div>
                 <div>
                     <p key={idx}>{feature.properties[key]}</p>
                 </div>
             </div>);
             })
          }
        </div>
      </div>
    </div>
  )
}

export default PopupInfo
