import React from "react";
import "./placeholder-animated-button.scss";

// const placeholder-animated-button = (props) => {
//     return (
//         <div className="input-container">
//             <input className={`input-anim ${props.className}`} required={props.required}/>
//             <label className="input-label">{props.label}</label>
//         </div>
//     )
// }

const PlaceholderAnimatedButton = (props) => {

    return (
        <div className={`input-container ${props.wrapper}`}>
            <input className={`${props.className} ${props.required === true ? "input-required" : "input-non-required"}`}
                   name={props.name}
                   required={props.required}/>
            <label className={`component-label ${props.labelStyle}`}>{props.text}</label>
        </div>
    )
}

export default PlaceholderAnimatedButton;