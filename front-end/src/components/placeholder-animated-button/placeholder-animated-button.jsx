import React from "react";
import "./placeholder-animated-button.scss";

const PlaceholderAnimatedButton = (props) => {
    const [input, setInput] = React.useState(props.value || '');

    let labelClass = null;

    if (props.value && input) {
        labelClass += ' input-if-default-value';
    }
    if (input) {
        labelClass += ' input-if-default-value';
    }

    const registerProps = ["id", "onChange", "onBlur", "name", "placeholder", "type", "value"];
    let additionalProps;
    if (registerProps.every(p => props.hasOwnProperty(p))) {
        additionalProps = props;
    }

    return (
        <div className={`input-container ${props.wrapper}`}>
            <input
                {...additionalProps}
                onChange={(e) => {
                    setInput(e.target.value);
                    if (props.onChange) {
                        props.onChange(e)
                    }
                }}
                className={`${props.className} ${props.required === true ? "input-required" : "input-non-required"}`}
                name={props.name}
                required={props.required}
            />
            <label className={`component-label ${props.labelStyle} ${labelClass}`}>{props.text}</label>
        </div>
    );
};

export default PlaceholderAnimatedButton;