import React, { useState } from "react";
import crossButton from "../images/remove.png";
import ButtonList from "./ButtonList";

function SidebarComponent({destinations,setFlyToCoordinates,sideComponentActive,setSideComponentActive, setIsDestinationClicked, adminComponentActive}) {
    
    let [checkedId, setCheckedId] = useState(-1);

    return (
        <div className={`sidebar ${sideComponentActive && !adminComponentActive ? "active" : ""}`}>
            <img
                src={crossButton}
                alt=""
                className="cross-button"
                onClick={() => setSideComponentActive(false)}
            />
            <div className="sidebar-first-section">
                <div className="side-section"></div>

                <div className="oil-sphere">
                    <h2 className="oil-sphere-title">Oil Spheres</h2>

                    <div className="location-option-list-outer">
                        <div className="location-option-list">
                            {destinations.map((obj, index) => {
                                return (
                                    <ButtonList
                                        key={index}
                                        obj={obj}
                                        index={index}
                                        setFlyToCoordinates={setFlyToCoordinates}
                                        checkedId={checkedId}
                                        setCheckedId={setCheckedId}
                                        setIsDestinationClicked={setIsDestinationClicked}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="sidebar-second-section"></div>
            <div className="sidebar-third-section"></div>
            <div className="sidebar-last-section">
                <p>Select a basemap</p>
            </div>
        </div>
    );
}

export default SidebarComponent;
