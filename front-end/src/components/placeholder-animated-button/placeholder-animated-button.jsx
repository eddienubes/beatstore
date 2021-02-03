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
    const [input, setInput] = React.useState(props.value || '');

    let labelClass = null;
    if (props.value && input) {
        labelClass += ' input-if-default-value';
    }
    if (input) {
        labelClass += ' input-if-default-value';
    }
    return (
        <div className={`input-container ${props.wrapper}`}>
            <input defaultValue={props.value}
                   onChange={(e) => setInput(e.target.value)}
                   className={`${props.className} ${props.required === true ? "input-required" : "input-non-required"}`}
                   name={props.name}
                   required={props.required}/>
            <label className={`component-label ${props.labelStyle} ${labelClass}`}>{props.text}</label>
        </div>
    );
};

export default PlaceholderAnimatedButton;